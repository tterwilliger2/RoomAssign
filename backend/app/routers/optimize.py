from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from ..database import get_session
from ..models import Dataset, ConfigModel, Solution
from ..schemas import OptimizeRequest, OptimizeResponse, RoomResponse
from ..services.optimize import run_optimization

router = APIRouter(prefix="/optimize", tags=["optimize"]) 


@router.post("", response_model=OptimizeResponse)
def optimize(
    payload: OptimizeRequest,
    session: Annotated[Session, Depends(get_session)],
):
    dataset = session.get(Dataset, payload.datasetId)
    config = session.get(ConfigModel, payload.configId)
    if not dataset or not config:
        raise HTTPException(status_code=404, detail="Dataset or config not found")
    members = dataset.get_members()

    result = run_optimization(members=members, config_json=config.config_json or "{}", time_limit_sec=payload.timeLimitSec)

    solution = Solution(
        dataset_id=dataset.id or 0,
        config_id=config.id or 0,
        score=result["score"],
        runtime_ms=result["runtimeMs"],
        rooms_json=__import__("json").dumps(result["rooms"]),
    )
    session.add(solution)
    session.commit()
    session.refresh(solution)

    return OptimizeResponse(
        solutionId=solution.id or 0,
        rooms=[RoomResponse(**room) for room in result["rooms"]],
        score=result["score"],
        hardViolations=result.get("hardViolations", []),
        softScores=result.get("softScores", {}),
        runtimeMs=result["runtimeMs"],
    )
