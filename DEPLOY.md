# Documentación de Despliegue - Maxipela Turnos API

Este backend está desplegado en Vercel y es accesible públicamente.

## URL Base
**`https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/`**

## Endpoints Disponibles

### 1. Verificar Estado
- **URL**: `https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/`
- **Método**: `GET`
- **Respuesta**: `{"message": "Welcome to Maxipela Turnos API"}`

### 2. Autenticación

#### Registro de Usuario
- **URL**: `https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/api/auth/register`
- **Método**: `POST`
- **Body (JSON)**:
  ```json
  {
    "login": "usuario1",
    "pswd": "password123",
    "name": "Nombre Usuario",
    "email": "usuario@email.com"
  }
  ```

#### Login
- **URL**: `https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/api/auth/login`
- **Método**: `POST`
- **Body (JSON)**:
  ```json
  {
    "login": "usuario1",
    "pswd": "password123"
  }
  ```
- **Respuesta**: Devuelve un `token` JWT que debes usar para las rutas protegidas.

### 3. Usuarios (Rutas Protegidas)

#### Obtener Perfil del Usuario Logueado
- **URL**: `https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/api/users/me`
- **Método**: `GET`
- **Headers**:
  - `Authorization`: `Bearer <TU_TOKEN_AQUI>`
- **Respuesta**: Datos del usuario (login, nombre, email, etc.).

## Notas Importantes sobre la Base de Datos

Actualmente, el backend en Vercel está configurado para conectarse a una base de datos **PostgreSQL (Vercel Postgres)**.

**Si obtienes errores de conexión (500 Internal Server Error)**, asegúrate de haber creado una base de datos Postgres en tu proyecto de Vercel y que las variables de entorno se hayan generado automáticamente:

- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Adicionalmente, asegúrate de configurar:
- `JWT_SECRET`: Tu clave secreta para los tokens.

> **Nota**: El código detecta automáticamente estas variables y se conecta a Postgres cuando está en Vercel.

## Colección de Postman
Se ha incluido un archivo `postman_collection_vercel.json` en este repositorio. Puedes importarlo directamente en Postman para probar todas las rutas configuradas con la URL de producción actualizada.
