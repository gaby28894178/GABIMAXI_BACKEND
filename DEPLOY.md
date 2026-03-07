# Documentación de Despliegue - Maxipela Turnos API

Este backend está desplegado en Vercel y es accesible públicamente.

## URL Base
**`https://gabimaxi-backend.vercel.app/`**

## Endpoints Disponibles

### 1. Verificar Estado
- **URL**: `https://gabimaxi-backend.vercel.app/`
- **Método**: `GET`
- **Respuesta**: `{"message": "Welcome to Maxipela Turnos API"}`

### 2. Autenticación

#### Registro de Usuario
- **URL**: `https://gabimaxi-backend.vercel.app/api/auth/register`
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
- **URL**: `https://gabimaxi-backend.vercel.app/api/auth/login`
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
- **URL**: `https://gabimaxi-backend.vercel.app/api/users/me`
- **Método**: `GET`
- **Headers**:
  - `Authorization`: `Bearer <TU_TOKEN_AQUI>`
- **Respuesta**: Datos del usuario (login, nombre, email, etc.).

## Notas Importantes sobre la Base de Datos

Actualmente, el backend en Vercel está configurado para conectarse a una base de datos **MySQL externa**. 

**Si obtienes errores de conexión (500 Internal Server Error)**, asegúrate de haber configurado las siguientes Variables de Entorno en el panel de Vercel (Settings -> Environment Variables):

- `DB_HOST`: La dirección de tu base de datos en la nube (ej. aws.connect.psdb.cloud).
- `DB_USER`: Tu usuario de base de datos.
- `DB_PASSWORD`: Tu contraseña de base de datos.
- `DB_NAME`: `maxipela_turnos`
- `DB_PORT`: El puerto (generalmente 3306).
- `JWT_SECRET`: Tu clave secreta para los tokens.

> **Nota**: Vercel NO puede conectarse a tu base de datos local (`localhost`). Debes usar un proveedor de base de datos en la nube (como PlanetScale, Aiven, Railway, o Clever Cloud).

## Colección de Postman
Se ha incluido un archivo `postman_collection_vercel.json` en este repositorio. Puedes importarlo directamente en Postman para probar todas las rutas configuradas con la URL de producción.
