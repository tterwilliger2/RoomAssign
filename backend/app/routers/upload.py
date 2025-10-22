from typing import Annotated
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session
import pandas as pd
import os
from ..database import get_session
from ..models import Dataset
from ..schemas import UploadCSVResponse
from ..services.preprocess import preprocess_dataframe

router = APIRouter(prefix="/upload", tags=["upload"]) 

DATA_DIR = "app_data"
os.makedirs(DATA_DIR, exist_ok=True)


@router.post("/csv", response_model=UploadCSVResponse)
async def upload_csv(
    file: UploadFile = File(...),
    session: Annotated[Session, Depends(get_session)] = None,
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Please upload a CSV file")
    raw_path = os.path.join(DATA_DIR, file.filename)
    with open(raw_path, "wb") as f:
        f.write(await file.read())
    df = pd.read_csv(raw_path)
    members = preprocess_dataframe(df)

    dataset = Dataset(label=file.filename, raw_csv_path=raw_path)
    dataset.set_members(members)
    session.add(dataset)
    session.commit()
    session.refresh(dataset)

    return UploadCSVResponse(datasetId=dataset.id or 0, memberCount=len(members.get("members", [])))
