from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session
import csv
import io
import json
from ..database import get_session
from ..models import Solution, Move
from ..schemas import ApplyMoveRequest
from ..services.validate import validate_solution_move

router = APIRouter(prefix="/solution", tags=["solution"]) 


@router.post("/{solution_id}/apply-move")
def apply_move(
    solution_id: int,
    payload: ApplyMoveRequest,
    session: Annotated[Session, Depends(get_session)],
):
    sol = session.get(Solution, solution_id)
    if not sol or not sol.rooms_json:
        raise HTTPException(status_code=404, detail="Solution not found")
    rooms = json.loads(sol.rooms_json)

    updated_rooms, violations = validate_solution_move(rooms, payload)

    sol.rooms_json = json.dumps(updated_rooms)
    session.add(sol)

    move = Move(
        solution_id=solution_id,
        member_id=payload.memberId,
        from_room_id=payload.fromRoomId,
        to_room_id=payload.toRoomId,
    )
    session.add(move)
    session.commit()

    return {"rooms": updated_rooms, "violations": violations}


@router.get("/{solution_id}/export.csv")
def export_csv(solution_id: int, session: Annotated[Session, Depends(get_session)]):
    sol = session.get(Solution, solution_id)
    if not sol or not sol.rooms_json:
        raise HTTPException(status_code=404, detail="Solution not found")
    rooms = json.loads(sol.rooms_json)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Room", "Capacity", "Member ID", "Member Name"])  # name may require lookup in future
    for room in rooms:
        for m in room.get("members", []):
            writer.writerow([room["label"], room["capacity"], m.get("id"), m.get("name", "")])
    return Response(content=buf.getvalue(), media_type="text/csv")


@router.get("/{solution_id}/export.json")
def export_json(solution_id: int, session: Annotated[Session, Depends(get_session)]):
    sol = session.get(Solution, solution_id)
    if not sol or not sol.rooms_json:
        raise HTTPException(status_code=404, detail="Solution not found")
    return Response(content=sol.rooms_json, media_type="application/json")
