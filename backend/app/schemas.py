from __future__ import annotations
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class Member(BaseModel):
    id: str
    name: str
    year: Optional[str] = None
    attributes: Dict[str, Any] = Field(default_factory=dict)
    rankedRoomSizes: Dict[str, int] = Field(default_factory=dict)
    requestedWith: List[str] = Field(default_factory=list)
    avoidWith: List[str] = Field(default_factory=list)


class RoomTemplate(BaseModel):
    id: str
    label: str
    capacity: int
    allowEmptyBeds: Optional[bool] = True


class HardConstraints(BaseModel):
    mutualDislikePairs: List[List[str]] = Field(default_factory=list)
    maxPerRoom: Dict[str, int] = Field(default_factory=dict)
    mustTogetherPairs: List[List[str]] = Field(default_factory=list)
    mustApartPairs: List[List[str]] = Field(default_factory=list)
    fixedRoomAssignments: Dict[str, str] = Field(default_factory=dict)


class SoftWeights(BaseModel):
    alpha: float = 0.2
    beta: float = 0.1
    gamma: float = 0.1


class ConstraintConfig(BaseModel):
    hard: HardConstraints = Field(default_factory=HardConstraints)
    soft: SoftWeights = Field(default_factory=SoftWeights)
    pairwiseW: Dict[str, Dict[str, float]] = Field(default_factory=dict)


class OptimizeRequest(BaseModel):
    datasetId: int
    configId: int
    timeLimitSec: int = 300


class RoomResponse(BaseModel):
    id: str
    label: str
    capacity: int
    members: List[Member] = Field(default_factory=list)


class OptimizeResponse(BaseModel):
    solutionId: int
    rooms: List[RoomResponse]
    score: float
    hardViolations: List[str]
    softScores: Dict[str, float]
    runtimeMs: int


class UploadCSVResponse(BaseModel):
    datasetId: int
    memberCount: int


class ApplyMoveRequest(BaseModel):
    roomId: Optional[str]
    memberId: str
    fromRoomId: Optional[str] = None
    toRoomId: Optional[str] = None


class ConfigSaveRequest(BaseModel):
    datasetId: int
    config: Dict[str, Any]


class AuthRegisterRequest(BaseModel):
    email: str
    password: str


class AuthLoginRequest(BaseModel):
    email: str
    password: str


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
