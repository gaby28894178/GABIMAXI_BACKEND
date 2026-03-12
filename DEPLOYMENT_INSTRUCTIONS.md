# 🚀 Instrucciones de Deployment - ACTUALIZADO

## ✅ Cambios Realizados

Se corrigieron todos los problemas que impedían el deployment en Vercel y Render:

1. ✅ Handler serverless optimizado para Vercel
2. ✅ Inicialización de DB eficiente (solo una vez, no en cada request)
3. ✅ Detección automática de ambiente (production/development)
4. ✅ SSL configurado correctamente para ambientes cloud
5. ✅ Pool de conexiones optimizado para serverless
6. ✅ Soporte para múltiples nombres de variables de entorno
7. ✅ Configuración específica para Render (`render.yaml`)

---

## 📦 DEPLOYMENT EN VERCEL

### Paso 1: Configurar Variables de Entorno

En tu proyecto de Vercel (Dashboard > Settings > Environment Variables), agrega:

```
NODE_ENV=production
JWT_SECRET=<genera_uno_seguro>
```

**Para generar JWT_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Paso 2: Crear Base de Datos Postgres

1. Ve a tu proyecto en Vercel
2. Click en **Storage** > **Create Database**
3. Selecciona **Postgres** (NO Edge Config, NO KV)
4. Nombre: `maxipela-db`
5. Click **Create** y luego **Connect to Project**

Esto generará automáticamente:
- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### Paso 3: Deploy

```bash
# Si no tienes Vercel CLI instalado
npm i -g vercel

# Deploy
vercel --prod
```

O simplemente haz push a tu repositorio si tienes integración con GitHub.

---

## 🎯 DEPLOYMENT EN RENDER

### Opción A: Usando render.yaml (Recomendado)

El archivo `render.yaml` ya está configurado. Solo necesitas:

1. Ir a [Render Dashboard](https://dashboard.render.com/)
2. Click en **New** > **Blueprint**
3. Conecta tu repositorio
4. Render detectará automáticamente `render.yaml`
5. Click **Apply**

Render creará automáticamente:
- El servicio web
- La base de datos PostgreSQL
- Las variables de entorno necesarias

### Opción B: Manual

#### 1. Crear Base de Datos

1. En Render Dashboard: **New** > **PostgreSQL**
2. Nombre: `maxipela-db`
3. Database: `maxipela`
4. User: `maxipela_user`
5. Region: Oregon (o la más cercana)
6. Plan: Free
7. Click **Create Database**

#### 2. Crear Web Service

1. **New** > **Web Service**
2. Conecta tu repositorio
3. Configuración:
   - **Name**: `maxipela-backend`
   - **Environment**: `Node`
   - **Region**: Oregon
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

#### 3. Variables de Entorno

En el Web Service, agrega:

```
NODE_ENV=production
JWT_SECRET=<genera_uno_seguro>
DATABASE_URL=<copia_de_la_base_de_datos>
```

Para obtener `DATABASE_URL`:
- Ve a tu base de datos en Render
- Copia la **Internal Connection String**

#### 4. Deploy

Click en **Create Web Service**. Render hará el deploy automáticamente.

---

## 🧪 Verificar que Funciona

### Test Local (antes de deployar)

```bash
# Instalar dependencias
npm install

# Configurar .env
cp .env_example .env
# Edita .env con tus valores

# Iniciar servidor
npm start
```

Deberías ver:
```
✅ Conexión a PostgreSQL establecida
✅ Modelos sincronizados
🚀 Servidor corriendo en http://localhost:3000
```

### Test en Producción

**Vercel:**
```bash
curl https://tu-proyecto.vercel.app/
```

**Render:**
```bash
curl https://tu-proyecto.onrender.com/
```

Respuesta esperada:
```json
{
  "message": "API Maxipela Turnos - Online",
  "timestamp": "2024-..."
}
```

### Test de Registro

```bash
curl -X POST https://tu-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "login": "test",
    "pswd": "test123",
    "name": "Test User",
    "email": "test@test.com"
  }'
```

---

## 🔧 Troubleshooting

### Error: "DATABASE_URL no configurada"

**Solución:**
- Vercel: Asegúrate de haber creado la base de datos Postgres y conectado al proyecto
- Render: Verifica que `DATABASE_URL` esté en las variables de entorno

### Error: "Connection timeout"

**Solución:**
- Verifica que la región de la DB sea la misma que el servicio
- En Render, usa la **Internal Connection String**, no la External

### Error: "JWT_SECRET no configurado"

**Solución:**
- Agrega `JWT_SECRET` en las variables de entorno del dashboard
- Genera uno seguro con: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### Logs en Vercel

```bash
vercel logs <deployment-url>
```

### Logs en Render

Ve al dashboard > tu servicio > Logs (en tiempo real)

---

## 📝 Notas Importantes

1. **Primera ejecución**: Las tablas se crean automáticamente en el primer request
2. **Migraciones**: En producción real, considera usar migraciones de Sequelize en vez de `sync()`
3. **Seguridad**: Cambia `JWT_SECRET` por uno generado aleatoriamente
4. **Performance**: El pool de conexiones está optimizado para serverless (max: 3)
5. **SSL**: Se activa automáticamente en producción

---

## 🎉 ¡Listo!

Tu API ahora debería funcionar correctamente en:
- ✅ Local (desarrollo)
- ✅ Vercel (serverless)
- ✅ Render (servidor tradicional)
