from pydantic import BaseModel, Field, HttpUrl


class GaleriaItemBase(BaseModel):
    titulo: str = Field(min_length=1, max_length=200)
    descripcion: str = ""
    url_imagen: HttpUrl
    album: str = Field(default="principal", max_length=100)
    orden: int = Field(default=0, ge=0)


class GaleriaItemCreate(GaleriaItemBase):
    pass


class GaleriaItemUpdate(BaseModel):
    titulo: str | None = Field(default=None, max_length=200)
    descripcion: str | None = None
    url_imagen: HttpUrl | None = None
    album: str | None = Field(default=None, max_length=100)
    orden: int | None = Field(default=None, ge=0)


class GaleriaItemReplace(GaleriaItemBase):
    """Mismo cuerpo que crear: actualización completa (PUT)."""


class AlbumBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    descripcion: str = ""
    orden: int = Field(default=0, ge=0)


class AlbumCreate(AlbumBase):
    pass


class AlbumUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=100)
    descripcion: str | None = None
    orden: int | None = Field(default=None, ge=0)


class AlbumReplace(AlbumBase):
    pass


class GaleriaImagenSubidaRespuesta(BaseModel):
    """Respuesta de POST /galeria/items/subir-imagen: usa `url` en `url_imagen` al crear el ítem."""

    url: str
    ruta_publica: str
    nombre_archivo: str
