from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import json
from ..database import get_session
from ..models import Solution

router = APIRouter(prefix="/solution", tags=["export"]) 


@router.get("/{solution_id}/export.pdf")
def export_pdf(solution_id: int, session: Annotated[Session, Depends(get_session)]):
    sol = session.get(Solution, solution_id)
    if not sol or not sol.rooms_json:
        raise HTTPException(status_code=404, detail="Solution not found")
    rooms = json.loads(sol.rooms_json)

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    width, height = letter

    y = height - 50
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"Room Wizard Assignment #{solution_id}")
    y -= 30

    c.setFont("Helvetica", 11)
    for room in rooms:
        if y < 100:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 11)
        c.drawString(50, y, f"Room {room.get('label')} (cap {room.get('capacity')})")
        y -= 18
        for m in room.get("members", []):
            c.drawString(70, y, f"- {m.get('name', m.get('id'))}")
            y -= 14
        y -= 8

    c.showPage()
    c.save()

    pdf = buf.getvalue()
    buf.close()
    return Response(content=pdf, media_type="application/pdf")
