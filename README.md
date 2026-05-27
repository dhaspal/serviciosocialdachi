# Servicio Social

Proyecto unificado para despliegue en **Render**: sitio web (React + Vite) y API (FastAPI + MongoDB) en un solo repositorio.

## Estructura

```
.
├── frontend/          # React + TypeScript + Vite
├── backend/           # FastAPI + MongoDB
│   ├── app/
│   ├── uploads/
│   └── requirements.txt
├── package.json       # Scripts de build del frontend
├── requirements.txt   # Dependencias Python (apunta a backend/)
└── render.yaml        # Configuración de despliegue en Render
```

En producción, el backend sirve el build estático de `frontend/dist` en la misma URL que el API (`/api/v1`, `/uploads`, `/health`, `/docs`).

## Desarrollo local

### 1. MongoDB

```bash
cd backend
docker compose up -d
```

### 2. Backend

```bash
cd backend
python -m venv .venv
# Windows: .\.venv\Scripts\pip install -r requirements.txt
pip install -r requirements.txt
copy ..\.env.example .env   # ajusta MONGODB_URI
.\scripts\dev.ps1           # o: uvicorn app.main:app --reload --port 8000
```

### 3. Frontend

```bash
npm run install:frontend
copy .env.example frontend\.env   # VITE_API_BASE_URL=http://localhost:8000
npm run dev:frontend
```

Abre `http://localhost:5173` (frontend) con el API en `http://localhost:8000`.

## Despliegue en Render

1. Sube este repositorio a GitHub.
2. En Render: **New → Blueprint** (si usas `render.yaml`) o **New Web Service**.
3. Variables de entorno obligatorias:
   - `MONGODB_URI` — cadena de conexión a MongoDB Atlas.
   - `MONGODB_DB` — nombre de la base (por defecto `servicio_social`).
4. **Build command:** `pip install -r requirements.txt && npm ci --prefix frontend && npm run build --prefix frontend`
5. **Start command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

No hace falta definir `VITE_API_BASE_URL` en Render: en producción el frontend usa el mismo origen que el servicio.

## Documentación del API

Con el backend en marcha: `http://localhost:8000/docs`  
Guía para el frontend: [backend/API_FRONTEND.md](backend/API_FRONTEND.md)
