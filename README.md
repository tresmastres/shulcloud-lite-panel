# ShulCloud-Lite — Panel (React + Vite, Español)

Panel sencillo para administrar **familias, miembros y facturas** contra tu backend FastAPI.

## Variables
- `VITE_API_BASE` (opcional): URL del backend. Por defecto usa `https://or-hayeladim.onrender.com`.

## Local
```bash
npm i
npm run dev
# abre http://localhost:5173
```

## Render (Static Site)
1) Sube este proyecto a GitHub.
2) En Render → **New + → Static Site** → conecta el repo.
3) **Build Command**: `npm install && npm run build`
4) **Publish Directory**: `dist`
5) (Opcional) **Environment Variables**: `VITE_API_BASE=https://TU_BACKEND.onrender.com`
6) Deploy y listo.
