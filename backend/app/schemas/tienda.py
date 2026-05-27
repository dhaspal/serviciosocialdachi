from pydantic import BaseModel, Field


class ProductoBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=200)
    descripcion: str = ""
    precio: float = Field(ge=0)
    sku: str | None = Field(default=None, max_length=80)
    categoria: str = Field(default="general", max_length=80)
    stock: int = Field(ge=0, default=0)
    activo: bool = True


class ProductoCreate(ProductoBase):
    pass


class ProductoUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=200)
    descripcion: str | None = None
    precio: float | None = Field(default=None, ge=0)
    sku: str | None = Field(default=None, max_length=80)
    categoria: str | None = Field(default=None, max_length=80)
    stock: int | None = Field(default=None, ge=0)
    activo: bool | None = None


class ProductoReplace(ProductoBase):
    """Mismo cuerpo que crear: actualización completa (PUT)."""


class CategoriaBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=80)
    descripcion: str = ""
    orden: int = Field(default=0, ge=0)
    activo: bool = True


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(BaseModel):
    nombre: str | None = Field(default=None, max_length=80)
    descripcion: str | None = None
    orden: int | None = Field(default=None, ge=0)
    activo: bool | None = None


class CategoriaReplace(CategoriaBase):
    pass
