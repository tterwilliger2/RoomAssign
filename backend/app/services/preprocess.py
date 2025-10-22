from __future__ import annotations
from typing import Dict, Any, List
import pandas as pd
import re


def _title_case_name(name: str) -> str:
    name = name.strip()
    # Handle mixed-case and extra whitespace
    return " ".join([part.capitalize() for part in re.split(r"\s+", name) if part])


def _split_multi(value: str) -> List[str]:
    if not isinstance(value, str):
        return []
    parts = re.split(r"[;,\n]", value)
    cleaned = [_title_case_name(p) for p in parts if p and p.strip()]
    # Deduplicate while preserving order
    seen = set()
    result: List[str] = []
    for c in cleaned:
        if c not in seen:
            seen.add(c)
            result.append(c)
    return result


def _coerce_int(value: Any, default: int | None = None) -> int | None:
    try:
        if pd.isna(value):
            return default
        return int(str(value).strip())
    except Exception:
        return default


def preprocess_dataframe(df: pd.DataFrame) -> Dict[str, Any]:
    # Normalize columns using best-effort matching
    cols = {c.lower().strip(): c for c in df.columns}

    def pick(*candidates: str) -> str | None:
        for cand in candidates:
            for k, orig in cols.items():
                if cand in k:
                    return orig
        return None

    name_col = pick("name") or "Name"
    year_col = pick("year")
    req_col = pick("roommate request", "roommate")
    dislike_col = pick("avoid", "dislike")
    messiness_col = pick("messiness")
    bother_col = pick("bother")
    sleep_col = pick("sleep")
    temp_col = pick("temp")
    room_use_col = pick("room use", "use")
    enforce_col = pick("wants preference enforced", "enforce")
    rank2_col = pick("2p rank", "rank 2")
    rank3_col = pick("3p rank", "rank 3")
    rank4_col = pick("4p rank", "rank 4")

    members: List[Dict[str, Any]] = []

    for _, row in df.iterrows():
        name_raw = str(row.get(name_col, "")).strip()
        if not name_raw:
            continue
        name = _title_case_name(name_raw)
        member_id = re.sub(r"[^a-z0-9]", "", name.lower())
        requested = _split_multi(str(row.get(req_col, ""))) if req_col else []
        avoid_with = _split_multi(str(row.get(dislike_col, ""))) if dislike_col else []
        ranked_sizes = {}
        r2 = _coerce_int(row.get(rank2_col)) if rank2_col else None
        r3 = _coerce_int(row.get(rank3_col)) if rank3_col else None
        r4 = _coerce_int(row.get(rank4_col)) if rank4_col else None
        if r2 is not None:
            ranked_sizes["2"] = r2
        if r3 is not None:
            ranked_sizes["3"] = r3
        if r4 is not None:
            ranked_sizes["4"] = r4

        attributes = {}
        if year_col:
            attributes["year"] = str(row.get(year_col, "")).strip()
        if messiness_col:
            attributes["messiness"] = _coerce_int(row.get(messiness_col), default=3) or 3
        if bother_col:
            attributes["bother"] = str(row.get(bother_col, "")).strip()
        if sleep_col:
            attributes["sleep"] = str(row.get(sleep_col, "")).strip().title()
        if temp_col:
            attributes["temperature"] = str(row.get(temp_col, "")).strip().title()
        if room_use_col:
            attributes["room_use"] = str(row.get(room_use_col, "")).strip().title()
        if enforce_col:
            val = str(row.get(enforce_col, "")).strip().lower()
            attributes["enforce"] = val in ("yes", "true", "1")

        members.append(
            {
                "id": member_id,
                "name": name,
                "year": attributes.get("year"),
                "attributes": attributes,
                "rankedRoomSizes": ranked_sizes,
                "requestedWith": requested,
                "avoidWith": avoid_with,
            }
        )

    return {"members": members}
