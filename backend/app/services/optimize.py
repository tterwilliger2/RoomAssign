from __future__ import annotations
from typing import Dict, Any, List
import json
from ortools.sat.python import cp_model


def run_optimization(members: Dict[str, Any], config_json: str, time_limit_sec: int = 300) -> Dict[str, Any]:
    config = json.loads(config_json or "{}")
    rooms_spec: List[Dict[str, Any]] = config.get("rooms", [])
    allow_empty_beds: bool = config.get("allowEmptyBeds", True)
    empty_bed_budget: int | None = config.get("emptyBedBudget")
    weights = config.get("weights", {"alpha": 0.2, "beta": 0.1, "gamma": 0.1})
    pairwiseW: Dict[str, Dict[str, float]] = config.get("pairwiseW", {})
    hard = config.get("hard", {})

    member_list: List[Dict[str, Any]] = members.get("members", [])
    P = len(member_list)
    R = len(rooms_spec)

    id_to_idx = {m["id"]: idx for idx, m in enumerate(member_list)}

    model = cp_model.CpModel()

    # Variables: x[p,r]
    x = {}
    for p in range(P):
        for r in range(R):
            x[p, r] = model.NewBoolVar(f"x_{p}_{r}")

    # Constraint: exactly one room per person
    for p in range(P):
        model.Add(sum(x[p, r] for r in range(R)) == 1)

    # Room capacity
    capacities = [int(room.get("capacity", 0)) for room in rooms_spec]
    if allow_empty_beds:
        for r in range(R):
            model.Add(sum(x[p, r] for p in range(P)) <= capacities[r])
        if empty_bed_budget is not None:
            total_assigned = sum(x[p, r] for p in range(P) for r in range(R))
            total_capacity = sum(capacities)
            # total empty = total_capacity - total_assigned
            # Enforce budget: total_empty <= budget => total_assigned >= total_capacity - budget
            model.Add(total_assigned >= total_capacity - empty_bed_budget)
    else:
        for r in range(R):
            model.Add(sum(x[p, r] for p in range(P)) == capacities[r])

    # Hard constraints: mustApart/mutualDislikePairs
    def idx_of(member_id: str) -> int | None:
        return id_to_idx.get(member_id)

    for pair_list_key in ("mustApartPairs", "mutualDislikePairs"):
        for pair in hard.get(pair_list_key, []):
            if len(pair) != 2:
                continue
            i = idx_of(pair[0])
            j = idx_of(pair[1])
            if i is None or j is None:
                continue
            for r in range(R):
                model.Add(x[i, r] + x[j, r] <= 1)

    # MustTogether
    for pair in hard.get("mustTogetherPairs", []):
        if len(pair) != 2:
            continue
        i = idx_of(pair[0])
        j = idx_of(pair[1])
        if i is None or j is None:
            continue
        for r in range(R):
            # x[i,r] == x[j,r] across all r ensures they are in the same room
            model.Add(x[i, r] == x[j, r])

    # Fixed room assignments: member_id -> room_id
    room_id_to_idx = {room.get("id"): idx for idx, room in enumerate(rooms_spec)}
    for mid, rid in hard.get("fixedRoomAssignments", {}).items():
        i = idx_of(mid)
        r = room_id_to_idx.get(rid)
        if i is not None and r is not None:
            # Force assignment
            model.Add(x[i, r] == 1)

    # Objective: pairwise terms
    def w(i: int, j: int) -> float:
        mi = member_list[i]["id"]
        mj = member_list[j]["id"]
        wi = pairwiseW.get(mi, {}).get(mj, 0.0)
        wj = pairwiseW.get(mj, {}).get(mi, 0.0)
        return wi + wj

    objective_terms: List[cp_model.LinearExpr] = []

    # Both[i,j,r] = AND(x[i,r], x[j,r])
    for r in range(R):
        for i in range(P):
            for j in range(i + 1, P):
                both = model.NewBoolVar(f"both_{i}_{j}_{r}")
                model.Add(both <= x[i, r])
                model.Add(both <= x[j, r])
                model.Add(both >= x[i, r] + x[j, r] - 1)
                wij = w(i, j)
                if wij != 0:
                    objective_terms.append(int(100 * wij) * both)

    # Size rank bonus
    # Expect config to include a map room_id -> size (capacity)
    rank_bonus = weights.get("alpha", 0.2)
    if rank_bonus:
        for r, room in enumerate(rooms_spec):
            cap = int(room.get("capacity", 0))
            for p, m in enumerate(member_list):
                rank = m.get("rankedRoomSizes", {}).get(str(cap))
                if rank is not None:
                    # Smaller rank better; convert to positive bonus via inverse
                    bonus = max(0, 5 - int(rank))  # crude mapping
                    if bonus:
                        objective_terms.append(int(100 * rank_bonus * bonus) * x[p, r])

    # Empty bed penalty (encourage filling rooms if allowed)
    beta = weights.get("beta", 0.1)
    if allow_empty_beds and beta:
        for r in range(R):
            filled = sum(x[p, r] for p in range(P))
            empty = capacities[r] - filled
            # Penalty => subtract from objective
            objective_terms.append(int(-100 * beta) * empty)

    model.Maximize(sum(objective_terms))

    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = float(time_limit_sec)
    solver.parameters.num_search_workers = 8

    status = solver.Solve(model)

    assigned_rooms: List[Dict[str, Any]] = [
        {
            "id": room.get("id"),
            "label": room.get("label"),
            "capacity": int(room.get("capacity", 0)),
            "members": [],
        }
        for room in rooms_spec
    ]

    for p, m in enumerate(member_list):
        for r in range(R):
            if solver.BooleanValue(x[p, r]):
                assigned_rooms[r]["members"].append(m)

    # Basic hard violation reporting (post-hoc)
    hard_violations: List[str] = []
    # Capacity overfill check
    for room in assigned_rooms:
        if len(room["members"]) > room["capacity"]:
            hard_violations.append(f"Room {room['label']} over capacity")

    score = solver.ObjectiveValue() / 100.0

    return {
        "rooms": assigned_rooms,
        "score": score,
        "hardViolations": hard_violations,
        "softScores": {},
        "runtimeMs": int(1000 * solver.WallTime()),
    }
