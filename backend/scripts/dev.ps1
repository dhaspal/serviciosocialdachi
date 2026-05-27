# Arranca el API en http://0.0.0.0:8000 (desde la raíz del backend).
Set-Location $PSScriptRoot\..
if (-not (Test-Path .\.venv\Scripts\python.exe)) {
    Write-Error "Crea el venv: python -m venv .venv && .\.venv\Scripts\pip install -r requirements.txt"
    exit 1
}
& .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
