from datetime import datetime

from pydantic import BaseModel, Field


class AdminLogin(BaseModel):
    usuario: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=1)


class AdminUserCreate(BaseModel):
    usuario: str = Field(min_length=1, max_length=120)
    nombre: str = Field(min_length=1, max_length=120)
    rol: str = Field(default="admin", max_length=50)
    password: str = Field(min_length=8, max_length=128)


class AdminUserUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=120)
    rol: str | None = Field(default=None, max_length=50)
    activo: bool | None = None


class AdminUserReplace(BaseModel):
    """Cuerpo para PUT: reemplazo completo del usuario (sin tocar id ni creado_en)."""

    usuario: str = Field(min_length=1, max_length=120)
    nombre: str = Field(min_length=1, max_length=120)
    rol: str = Field(default="admin", max_length=50)
    activo: bool = True
    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=128,
        description="Si se envía, sustituye la contraseña.",
    )


class AdminMetricas(BaseModel):
    usuarios_total: int
    productos_total: int
    posts_total: int
    items_galeria_total: int


class AdminSesionRespuesta(BaseModel):
    mensaje: str
    token_placeholder: str
    expira: datetime
