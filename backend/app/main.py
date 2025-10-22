from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from .config import get_settings
from .database import init_db, engine
from .auth import get_or_create_admin
from .routers import auth, health, upload, config as cfg, optimize, solution
from .routers import export_pdf


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="Room Wizard", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.cors_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    init_db()
    # Seed admin user
    with Session(engine) as session:
        get_or_create_admin(session)

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(upload.router)
    app.include_router(cfg.router)
    app.include_router(optimize.router)
    app.include_router(solution.router)
    app.include_router(export_pdf.router)

    return app


app = create_app()
