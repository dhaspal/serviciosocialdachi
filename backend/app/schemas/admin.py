from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class AdminLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class AdminUserCreate(BaseModel):
    email: EmailStr
    nombre: str = Field(min_length=1, max_length=120)
    rol: str = Field(default="admin", max_length=50)


class AdminUserUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=120)
    rol: str | None = Field(default=None, max_length=50)
    activo: bool | None = None


class AdminUserReplace(BaseModel):
    """Cuerpo para PUT: reemplazo completo del usuario (sin tocar id ni creado_en)."""

    email: EmailStr
    nombre: str = Field(min_length=1, max_length=120)
    rol: str = Field(default="admin", max_length=50)
    activo: bool = True
    password: str | None = Field(
        default=None,
        min_length=1,
        description="Si se envía, sustituye la contraseña (modo desarrollo).",
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
