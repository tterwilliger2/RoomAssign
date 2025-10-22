from typing import Iterator
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.engine import Engine
from .config import get_settings

_settings = get_settings()
engine: Engine = create_engine(
    _settings.database_url,
    connect_args={"check_same_thread": False} if _settings.database_url.startswith("sqlite") else {},
)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
