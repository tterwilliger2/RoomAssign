from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
import json
from ..database import get_session
from ..models import ConfigModel, Dataset
from ..schemas import ConfigSaveRequest
from ..services.weights import build_pairwise_weights

router = APIRouter(prefix="/config", tags=["config"]) 


@router.post("")
def save_config(
    payload: ConfigSaveRequest,
    session: Annotated[Session, Depends(get_session)],
):
    # If pairwiseW is missing, compute it from dataset members
    cfg = dict(payload.config)
    if not cfg.get("pairwiseW"):
        dataset = session.get(Dataset, payload.datasetId)
        if not dataset:
            raise HTTPException(status_code=404, detail="Dataset not found")
        members_doc = dataset.get_members()
        cfg["pairwiseW"] = build_pairwise_weights(members_doc)
    config = ConfigModel(dataset_id=payload.datasetId, config_json=json.dumps(cfg))
    session.add(config)
    session.commit()
    session.refresh(config)
    return {"configId": config.id}
