# Quiniela Frontend - Mundial 2026

React + Vite + Tailwind v4 + React Router + Axios.
Conecta con el backend (quiniela-backend) vía JWT.

## Instalación

```bash
npm install
```

## Configurar API

Crea un archivo `.env` (copia de `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Para producción (Render), usa la URL de tu backend desplegado:

```
VITE_API_URL=https://TU-BACKEND.onrender.com/api
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:5173

## Compilar para producción

```bash
npm run build
```

Genera la carpeta `dist/`.

## Páginas

- `/`          → Login
- `/registro`  → Crear cuenta
- `/dashboard` → Resumen y mis pronósticos (privado)
- `/quiniela`  → Los 14 partidos para pronosticar (privado)
- `/ranking`   → Tabla general (privado)
- `/envivo`    → Partidos en vivo y finalizados (privado)

## Cómo conecta con el backend

- El token JWT se guarda en localStorage al hacer login/registro.
- `services/api.js` lo adjunta automáticamente en cada petición como
  `Authorization: Bearer <token>`.
- Las rutas privadas redirigen a `/` si no hay sesión.

## Despliegue en Vercel

1. Sube el código a GitHub
2. Importa el repo en Vercel
3. Framework: Vite
4. Variable de entorno: `VITE_API_URL` = URL de tu backend
5. Deploy

## Despliegue en Render (Static Site)

1. Build command: `npm install && npm run build`
2. Publish directory: `dist`
3. Variable de entorno: `VITE_API_URL`
4. IMPORTANTE (SPA): agrega una Rewrite Rule
   Source: `/*`  →  Destination: `/index.html`
   (para que las rutas como /quiniela funcionen al recargar)

## Valores de pronóstico

Los botones se muestran como L / E / V pero se guardan como:
- "1" = gana Local
- "X" = Empate
- "2" = gana Visitante

Esto coincide con cómo el backend calcula el resultado.
