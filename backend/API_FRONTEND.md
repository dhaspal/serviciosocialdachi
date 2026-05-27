# API Backend — Guía para frontend

Servicio Social API (FastAPI + MongoDB). Todas las rutas de negocio llevan el prefijo configurado por variable de entorno `API_PREFIX` (por defecto **`/api/v1`**).

## Convenciones

| Aspecto | Detalle |
|--------|---------|
| Base URL ejemplo | `http://localhost:8000` |
| Prefijo API | `{BASE}{API_PREFIX}` → ej. `http://localhost:8000/api/v1` |
| Formato | JSON (`Content-Type: application/json`) |
| Identificadores | Los documentos devuelven **`id`** (string, ObjectId de MongoDB), no `_id` |
| Actualización completa | **`PUT`**: reemplaza el recurso (campos obligatorios según esquema de creación / replace) |
| Actualización parcial | **`PATCH`**: solo los campos enviados |
| Errores habituales | `400` id inválido, `404` no existe, `409` conflicto (slug/nombre duplicado), `401` login admin |

OpenAPI interactiva: `{BASE}/docs` (Swagger UI).

---

## Administrador — prefijo `/admin`

### Login y métricas (no son CRUD de entidad)

| Método | Ruta relativa al prefijo API | Cuerpo | Respuesta |
|--------|------------------------------|--------|-----------|
| `POST` | `/admin/login` | `{ "email", "password" }` | Sesión de desarrollo (`token_placeholder`, `expira`, …) |
| `GET` | `/admin/metricas` | — | Totales agregados (`usuarios_total`, `productos_total`, `posts_total`, `items_galeria_total`) |

**Login (desarrollo):** si ya hay usuarios en BD, contraseña de prueba **`admin123`**. Si no hay usuarios, el login informa que primero hay que crear uno con `POST /admin/usuarios`.

### Usuarios administradores — recurso `/admin/usuarios`

| Método | Ruta | Cuerpo |
|--------|------|--------|
| `GET` | `/admin/usuarios` | — |
| `GET` | `/admin/usuarios/{usuario_id}` | — |
| `POST` | `/admin/usuarios` | `{ "email", "nombre", "rol?" }` |
| `PUT` | `/admin/usuarios/{usuario_id}` | `{ "email", "nombre", "rol", "activo", "password?" }` — reemplazo completo |
| `PATCH` | `/admin/usuarios/{usuario_id}` | `{ "nombre?", "rol?", "activo?" }` |
| `DELETE` | `/admin/usuarios/{usuario_id}` | — |

- `POST 201`, `DELETE 204`.
- `password` en `PUT` es opcional; si se omite, se conserva el hash almacenado.

---

## Tienda — prefijo `/tienda`

### Categorías (catálogo propio, colección `tienda_categorias`)

| Método | Ruta | Cuerpo |
|--------|------|--------|
| `GET` | `/tienda/categorias` | Query: `solo_activas`, `skip`, `limit` |
| `GET` | `/tienda/categorias/{categoria_id}` | — |
| `POST` | `/tienda/categorias` | `{ "nombre", "descripcion?", "orden?", "activo?" }` |
| `PUT` | `/tienda/categorias/{categoria_id}` | Igual que POST — reemplazo completo |
| `PATCH` | `/tienda/categorias/{categoria_id}` | Campos opcionales |
| `DELETE` | `/tienda/categorias/{categoria_id}` | — |

### Productos — recurso `/tienda/productos`

| Método | Ruta | Cuerpo / notas |
|--------|------|----------------|
| `GET` | `/tienda/productos` | Query: `categoria`, `solo_activos`, `skip`, `limit` |
| `GET` | `/tienda/productos/categorias/usadas` | — Lista de strings usados en el campo `categoria` de productos |
| `GET` | `/tienda/productos/{producto_id}` | — |
| `POST` | `/tienda/productos` | `{ "nombre", "descripcion", "precio", "sku?", "categoria", "stock", "activo" }` |
| `PUT` | `/tienda/productos/{producto_id}` | Mismo esquema que POST — reemplazo completo |
| `PATCH` | `/tienda/productos/{producto_id}` | Campos opcionales |
| `DELETE` | `/tienda/productos/{producto_id}` | — |

**Importante:** la ruta **`/tienda/productos/categorias/usadas`** debe llamarse como está (va **antes** que `/{producto_id}` en el router). El campo `categoria` en productos es texto libre; el catálogo administrado está en `/tienda/categorias`.

---

## Blog — prefijo `/blog`

### Entradas — recurso `/blog/posts`

| Método | Ruta | Cuerpo / notas |
|--------|------|----------------|
| `GET` | `/blog/posts` | Query: `publicados`, `etiqueta`, `skip`, `limit` |
| `GET` | `/blog/posts/slug/{slug}` | — Lectura por slug |
| `GET` | `/blog/posts/{post_id}` | — |
| `POST` | `/blog/posts` | `{ "titulo", "slug", "resumen", "contenido", "publicado", "etiquetas" }` |
| `PUT` | `/blog/posts/{post_id}` | Mismo esquema que POST — reemplazo completo (`slug` único) |
| `PATCH` | `/blog/posts/{post_id}` | Campos opcionales (`slug` único si se cambia) |
| `DELETE` | `/blog/posts/{post_id}` | — |

---

## Galería — prefijo `/galeria`

### Álbumes (catálogo propio, colección `galeria_albumes`)

| Método | Ruta | Cuerpo |
|--------|------|--------|
| `GET` | `/galeria/albumes` | Query: `skip`, `limit` |
| `GET` | `/galeria/albumes/{album_id}` | — |
| `POST` | `/galeria/albumes` | `{ "nombre", "descripcion?", "orden?" }` |
| `PUT` | `/galeria/albumes/{album_id}` | Igual que POST — reemplazo completo |
| `PATCH` | `/galeria/albumes/{album_id}` | Campos opcionales |
| `DELETE` | `/galeria/albumes/{album_id}` | — |

### Ítems de galería — recurso `/galeria/items`

| Método | Ruta | Cuerpo / notas |
|--------|------|----------------|
| `GET` | `/galeria/items` | Query: `album`, `skip`, `limit` |
| `GET` | `/galeria/items/albumes/nombres` | — Valores distintos del campo `album` en ítems |
| `GET` | `/galeria/items/{item_id}` | — |
| `POST` | `/galeria/items` | `{ "titulo", "descripcion", "url_imagen", "album", "orden" }` |
| `PUT` | `/galeria/items/{item_id}` | Mismo esquema que POST — reemplazo completo |
| `PATCH` | `/galeria/items/{item_id}` | Campos opcionales |
| `DELETE` | `/galeria/items/{item_id}` | — |

**Importante:** **`/galeria/items/albumes/nombres`** debe usarse tal cual (ruta estática antes de `/{item_id}`). El campo `album` en ítems es texto; el catálogo de álbumes está en `/galeria/albumes`.

---

## Salud del servicio

| Método | Ruta (sin prefijo API) |
|--------|-------------------------|
| `GET` | `/health` |

---

## Resumen verbos por recurso principal

Para **usuarios admin**, **categorías**, **productos**, **posts**, **álbumes** e **ítems de galería** están disponibles:

`GET` (lista y por id), `POST`, **`PUT` (update completo)**, **`PATCH` (update parcial)`**, `DELETE`.

Los endpoints **`POST /admin/login`** y **`GET /admin/metricas`** no siguen el patrón CRUD; el resto de rutas de listados auxiliares son solo **`GET`**.
