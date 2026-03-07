# Documentación de Despliegue - Maxipela Turnos API

Este backend está desplegado en Vercel y es accesible públicamente.

## ⚠️ GUÍA IMPORTANTE PARA HABILITAR BASE DE DATOS (LEER PRIMERO)

Si al intentar usar la API recibes errores como `500 Internal Server Error` o en los logs ves `Vercel deployment requires a Postgres database configuration`, **es porque falta crear la base de datos en Vercel**.

### PASO 1: Crear la Base de Datos Correcta (NO Edge Config)

1. Ve a tu proyecto en **Vercel** (https://vercel.com).
2. Haz clic en la pestaña **Storage** (Almacenamiento) en la parte superior.
3. Haz clic en el botón **Create Database** (Crear Base de Datos).
4. **IMPORTANTE**: Selecciona **"Postgres"** (el icono azul de elefante o similar).
   - ❌ NO selecciones "Edge Config".
   - ❌ NO selecciones "KV".
   - ❌ NO selecciones "Blob".
   - ✅ **SELECCIONA "Postgres"**.
5. Acepta los términos y dale un nombre (ej: `maxipela-db`) y la región (puedes dejar la por defecto o elegir una cercana como `iad1` o `sfo1`).
6. Haz clic en **Create**.
7. En la siguiente pantalla, asegúrate de que esté marcado "Connect to Project" y selecciona tu proyecto actual.
8. Haz clic en **Connect**.

> **Nota**: Esto generará automáticamente las variables de entorno necesarias (`POSTGRES_URL`, etc.) y redesplegará tu proyecto automáticamente (o deberás hacer un nuevo despliegue manual en la pestaña Deployments).

### PASO 2: Crear la Tabla de Usuarios (¡NUEVO MÉTODO AUTOMÁTICO!)

Una vez creada la base de datos en Vercel (Paso 1), **no necesitas ejecutar comandos SQL manualmente**.

1. Simplemente abre esta URL en tu navegador:
   **`https://gabimaxi-backend-4qiq-git-gru-311bfd-gabriels-projects-ddae2e36.vercel.app/api/install/db`**

2. Si todo sale bien, verás un mensaje JSON confirmando que las tablas se han creado:
   ```json
   {
     "message": "Database tables created successfully!",
     "tables": ["sec_users"],
     "testUser": "test_cloud"
   }
   ```

3. ¡Listo! Ya puedes usar la API.

> **Método Manual (Alternativo)**: Si prefieres hacerlo manualmente, copia el contenido de `database_pg.sql` y ejecútalo en la consola de Vercel Storage.

---

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
