import pandas as pd
from app.services.preprocess import preprocess_dataframe


def test_preprocess_basic():
    df = pd.DataFrame([
        {
            "Name": "  alice  smith ",
            "Year": "SR",
            "Roommate Requests": "Bob; Carol\n dave",
            "Avoid": "Eve",
            "Messiness Rating": 4,
            "Sleep Schedule": "late",
            "Temperature Preference": "cool",
            "2p Rank": 1,
            "3p Rank": 2,
        }
    ])
    out = preprocess_dataframe(df)
    members = out["members"]
    assert len(members) == 1
    m = members[0]
    assert m["name"] == "Alice Smith"
    assert set(m["requestedWith"]) == {"Bob", "Carol", "Dave"}
    assert set(m["avoidWith"]) == {"Eve"}
    assert m["rankedRoomSizes"]["2"] == 1
    assert m["rankedRoomSizes"]["3"] == 2
