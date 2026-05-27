from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import close_db, connect_db
from app.paths import BACKEND_ROOT, GALERIA_UPLOAD_DIR, UPLOAD_ROOT
from app.routers import admin, blog, galeria, tienda

FRONTEND_DIST = BACKEND_ROOT.parent / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
    GALERIA_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="Servicio Social API",
    description="Backend con MongoDB: administrador, tienda, blog y galería.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.api_prefix.rstrip("/")
app.include_router(admin.router, prefix=prefix)
app.include_router(tienda.router, prefix=prefix)
app.include_router(blog.router, prefix=prefix)
app.include_router(galeria.router, prefix=prefix)
UPLOAD_ROOT.mkdir(parents=True, exist_ok=True)
GALERIA_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_ROOT)), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}


def _mount_frontend(app: FastAPI) -> None:
    """Sirve el build de Vite (SPA) en el mismo origen que el API (Render)."""
    if not FRONTEND_DIST.is_dir():
        return
    app.mount(
        "/",
        StaticFiles(directory=str(FRONTEND_DIST), html=True),
        name="frontend",
    )


_mount_frontend(app)
