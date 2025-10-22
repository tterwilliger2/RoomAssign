from app.services.optimize import run_optimization


def test_must_apart_enforced():
    members = {"members": [
        {"id": "a", "name": "Alice", "requestedWith": [], "avoidWith": []},
        {"id": "b", "name": "Bob", "requestedWith": [], "avoidWith": []},
    ]}
    rooms = [
        {"id": "R1", "label": "R1", "capacity": 2},
        {"id": "R2", "label": "R2", "capacity": 0},
    ]
    config = {
        "rooms": rooms,
        "allowEmptyBeds": True,
        "pairwiseW": {},
        "hard": {"mustApartPairs": [["a", "b"]]},
        "weights": {"alpha": 0.0, "beta": 0.0, "gamma": 0.0},
    }

    res = run_optimization(members, __import__("json").dumps(config), time_limit_sec=5)
    # They must not be in the same room
    r1_ids = {m['id'] for m in res['rooms'][0]['members']}
    assert len(r1_ids.intersection({"a", "b"})) <= 1
