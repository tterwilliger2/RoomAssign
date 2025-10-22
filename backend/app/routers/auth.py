from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlmodel import Session, select
from ..schemas import AuthRegisterRequest, AuthLoginRequest, AuthTokenResponse
from ..auth import create_access_token, verify_password, get_password_hash
from ..database import get_session
from ..models import User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthTokenResponse)
def register(
    payload: AuthRegisterRequest,
    session: Annotated[Session, Depends(get_session)],
):
    existing = session.exec(select(User).where(User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = User(email=payload.email, password_hash=get_password_hash(payload.password))
    session.add(user)
    session.commit()
    token = create_access_token(subject=user.email)
    return AuthTokenResponse(access_token=token)


@router.post("/login", response_model=AuthTokenResponse)
def login(
    payload: AuthLoginRequest,
    session: Annotated[Session, Depends(get_session)],
):
    user = session.exec(select(User).where(User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(subject=user.email)
    return AuthTokenResponse(access_token=token)
