from __future__ import annotations
from typing import Dict, Any, List, Tuple
from ..schemas import ApplyMoveRequest


def validate_solution_move(rooms: List[Dict[str, Any]], move: ApplyMoveRequest) -> tuple[list[dict[str, Any]], list[str]]:
    violations: List[str] = []
    member = None
    # Remove member from any room
    for room in rooms:
        for m in list(room.get("members", [])):
            if m.get("id") == move.memberId:
                member = m
                room["members"].remove(m)
                break
    if not member:
        # if not found, create placeholder
        member = {"id": move.memberId, "name": move.memberId}
    # Add to target room if provided
    if move.toRoomId:
        for room in rooms:
            if room.get("id") == move.toRoomId:
                room.setdefault("members", []).append(member)
                # capacity check
                if len(room["members"]) > int(room.get("capacity", 0)):
                    violations.append(f"Room {room.get('label')} over capacity")
                break
    else:
        # No target room -> staging zone (represented as missing room assignment in UI)
        pass

    return rooms, violations
