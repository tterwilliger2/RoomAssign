from __future__ import annotations
from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import Column, Text
import json


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    password_hash: str


class Dataset(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    label: str = Field(default="")
    raw_csv_path: Optional[str] = None
    normalized_members_json: Optional[str] = Field(
        default=None, sa_column=Column(Text)
    )

    def set_members(self, members: dict) -> None:
        self.normalized_members_json = json.dumps(members)

    def get_members(self) -> dict:
        return json.loads(self.normalized_members_json or "{}")


class ConfigModel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dataset_id: int = Field(index=True)
    config_json: Optional[str] = Field(default=None, sa_column=Column(Text))


class Solution(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dataset_id: int = Field(index=True)
    config_id: int = Field(index=True)
    score: float = 0.0
    runtime_ms: int = 0
    rooms_json: Optional[str] = Field(default=None, sa_column=Column(Text))
    audit_log_json: Optional[str] = Field(default=None, sa_column=Column(Text))


class Move(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    solution_id: int = Field(index=True)
    member_id: str
    from_room_id: Optional[str] = None
    to_room_id: Optional[str] = None
    reason: Optional[str] = None
