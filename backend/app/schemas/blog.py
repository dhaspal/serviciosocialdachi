from pydantic import BaseModel, Field


class PostBase(BaseModel):
    titulo: str = Field(min_length=1, max_length=220)
    slug: str = Field(min_length=1, max_length=220)
    resumen: str = ""
    contenido: str = ""
    publicado: bool = False
    etiquetas: list[str] = Field(default_factory=list)


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    titulo: str | None = Field(default=None, max_length=220)
    slug: str | None = Field(default=None, max_length=220)
    resumen: str | None = None
    contenido: str | None = None
    publicado: bool | None = None
    etiquetas: list[str] | None = None


class PostReplace(PostBase):
    """Mismo cuerpo que crear: actualización completa (PUT)."""
