from app.services.optimize import run_optimization
from app.services.weights import build_pairwise_weights


def test_optimize_tiny():
    members_doc = {
        "members": [
            {"id": "a", "name": "Alice", "attributes": {}, "requestedWith": ["Bob"], "avoidWith": []},
            {"id": "b", "name": "Bob", "attributes": {}, "requestedWith": ["Alice"], "avoidWith": []},
            {"id": "c", "name": "Carol", "attributes": {}, "requestedWith": [], "avoidWith": []},
        ]
    }
    rooms = [
        {"id": "R1", "label": "R1", "capacity": 2},
        {"id": "R2", "label": "R2", "capacity": 1},
    ]

    W = build_pairwise_weights(members_doc)
    config = {
        "rooms": rooms,
        "allowEmptyBeds": False,
        "pairwiseW": W,
        "hard": {"mustApartPairs": []},
        "weights": {"alpha": 0.0, "beta": 0.0, "gamma": 0.0},
    }

    result = run_optimization(members_doc, __import__("json").dumps(config), time_limit_sec=5)

    # Expect Alice and Bob together in R1 due to mutual like
    r1_members = [m["id"] for m in result["rooms"][0]["members"]]
    assert set(r1_members) == {"a", "b"}
    assert result["rooms"][1]["members"][0]["id"] == "c"
