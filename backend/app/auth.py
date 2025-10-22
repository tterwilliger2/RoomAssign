from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from passlib.context import CryptContext
from sqlmodel import Session, select
from .models import User
from .config import get_settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(subject: str, expires_minutes: int = 60) -> str:
    settings = get_settings()
    expire = datetime.now(tz=timezone.utc) + timedelta(minutes=expires_minutes)
    payload = {"sub": subject, "exp": expire}
    encoded_jwt = jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_alg)
    return encoded_jwt


def get_or_create_admin(session: Session) -> User:
    settings = get_settings()
    user = session.exec(select(User).where(User.email == settings.admin_email)).first()
    if not user:
        user = User(email=settings.admin_email, password_hash=get_password_hash(settings.admin_password))
        session.add(user)
        session.commit()
        session.refresh(user)
    return user
