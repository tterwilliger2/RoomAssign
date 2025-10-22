from __future__ import annotations
from typing import Dict, List, Tuple
import itertools

# Simple heuristic weights; can be tuned later
LIKE_SCORE = 3.0
DISLIKE_SCORE = -3.0
ATTR_MATCH = 0.5
ATTR_CLASH = -0.5


def build_pairwise_weights(members_doc: Dict) -> Dict[str, Dict[str, float]]:
    members: List[Dict] = members_doc.get("members", [])
    id_by_name = {m["name"]: m["id"] for m in members}

    w: Dict[str, Dict[str, float]] = {}
    for m in members:
        w[m["id"]] = {}

    for a, b in itertools.permutations(members, 2):
        i, j = a["id"], b["id"]
        score = 0.0
        # Explicit requests
        if b["name"] in a.get("requestedWith", []):
            score += LIKE_SCORE
        if b["name"] in a.get("avoidWith", []):
            score += DISLIKE_SCORE

        # Attribute agreements
        a_attr, b_attr = a.get("attributes", {}), b.get("attributes", {})
        for key in ("sleep", "temperature", "room_use"):
            av, bv = a_attr.get(key), b_attr.get(key)
            if av and bv:
                if av == bv:
                    score += ATTR_MATCH
                else:
                    score += ATTR_CLASH

        # Messiness proximity
        am, bm = a_attr.get("messiness"), b_attr.get("messiness")
        if isinstance(am, int) and isinstance(bm, int):
            diff = abs(am - bm)
            if diff <= 1:
                score += 0.3
            elif diff >= 3:
                score -= 0.3

        # Clamp to [-3, 3]
        if score > 3:
            score = 3.0
        if score < -3:
            score = -3.0

        w[i][j] = score

    return w
