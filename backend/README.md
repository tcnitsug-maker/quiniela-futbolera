# Quiniela Backend - Mundial 2026

API REST con Node.js, Express, MongoDB y JWT.

## Instalación

```bash
npm install
```

## Configurar .env

Edita el archivo `.env` con tus datos:

```
PORT=5000
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@cluster.mongodb.net/quiniela
JWT_SECRET=MiSecretoSuper2026
```

## Poblar base de datos

Crear concurso 2337 con sus 14 partidos:

```bash
npm run seed
```

Crear usuario administrador (admin@quiniela.com / admin123):

```bash
node seed/crearAdmin.js
```

## Ejecutar

Desarrollo:
```bash
npm run dev
```

Producción:
```bash
npm start
```

## Endpoints

### Auth (`/api/auth`)
- POST `/registrar` - { nombre, correo, password }
- POST `/login` - { correo, password }
- GET  `/perfil` - (requiere token)
- GET  `/ranking` - tabla general pública

### Concursos (`/api/concursos`)
- GET  `/` - todos
- GET  `/activo` - concurso activo
- POST `/` - crear (admin)

### Partidos (`/api/partidos`)
- GET  `/` - todos
- GET  `/concurso/:concursoId` - por concurso
- POST `/` - crear (admin)
- PUT  `/:id/resultado` - { golesLocal, golesVisitante } (admin) → califica automáticamente
- PUT  `/:id/estado` - { estado } (admin)

### Pronósticos (`/api/pronosticos`)
- POST `/` - { partidoId, pronostico } (requiere token)
- GET  `/mios` - mis pronósticos (token)
- GET  `/dashboard` - dashboard del usuario (token)

## Autenticación

Todas las rutas protegidas requieren header:

```
Authorization: Bearer TU_TOKEN
```

## Despliegue en Render

1. Sube el código a GitHub
2. Crea un Web Service en Render
3. Build: `npm install`
4. Start: `npm start`
5. Variables de entorno: PORT, MONGO_URI, JWT_SECRET
