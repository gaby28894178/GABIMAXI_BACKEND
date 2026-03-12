# 🔧 Changelog - Correcciones de Deployment

## Problemas Corregidos

### 1. ❌ Handler Serverless Incorrecto → ✅ Optimizado
**Antes:** `api/index.js` ejecutaba `sync()` en cada request
**Ahora:** Inicialización única con caché, reutilización de conexión

### 2. ❌ Sync de DB en cada request → ✅ Inicialización única
**Antes:** `sequelize.sync({ alter: true })` en cada llamada
**Ahora:** `initializeDatabase()` se ejecuta solo una vez

### 3. ❌ SSL condicional fallaba → ✅ Detección automática
**Antes:** `process.env.NODE_ENV === 'production'`
**Ahora:** `process.env.VERCEL || process.env.RENDER || process.env.NODE_ENV === 'production'`

### 4. ❌ Variables de entorno inconsistentes → ✅ Múltiples fallbacks
**Antes:** Solo `JWT_SECRET`
**Ahora:** `JWT_SECRET || TOKEN_SECRET` con warnings

### 5. ❌ Pool de conexiones para servidor tradicional → ✅ Optimizado para serverless
**Antes:** max: 5, idle: 10000
**Ahora:** max: 3, idle: 5000, evict: 1000

### 6. ❌ Sin configuración para Render → ✅ render.yaml agregado
**Antes:** Solo configurado para Vercel
**Ahora:** Soporte completo para Render con Blueprint

### 7. ❌ Token expiraba en 15 minutos → ✅ 24 horas
**Antes:** `expiresIn: '15m'`
**Ahora:** `expiresIn: '24h'` (mejor UX)

### 8. ❌ Servidor escuchaba solo en localhost → ✅ Todas las interfaces
**Antes:** `app.listen(PORT)`
**Ahora:** `app.listen(PORT, '0.0.0.0')` (necesario para Render)

### 9. ❌ .env_example con valores incorrectos → ✅ Documentado correctamente
**Antes:** `TOKEN_SECRET=require('crypto')...` (literal)
**Ahora:** Instrucciones claras de cómo generar el secreto

## Archivos Modificados

- ✏️ `api/index.js` - Handler serverless optimizado
- ✏️ `src/index.js` - Detección de ambiente serverless
- ✏️ `src/config/db.js` - Inicialización única, SSL automático, pool optimizado
- ✏️ `src/middlewares/auth.middleware.js` - Soporte para TOKEN_SECRET
- ✏️ `src/services/auth.service.js` - Token 24h, soporte TOKEN_SECRET
- ✏️ `.env_example` - Documentación correcta
- ✏️ `package.json` - Engines y metadata

## Archivos Nuevos

- 📄 `render.yaml` - Configuración automática para Render
- 📄 `DEPLOYMENT_INSTRUCTIONS.md` - Guía completa de deployment
- 📄 `CHANGELOG_FIXES.md` - Este archivo

## Próximos Pasos

1. **Hacer commit de los cambios:**
   ```bash
   git add .
   git commit -m "fix: corregir deployment en Vercel y Render"
   git push
   ```

2. **Configurar variables de entorno en Vercel:**
   - `NODE_ENV=production`
   - `JWT_SECRET=<generar_uno_seguro>`
   - Crear base de datos Postgres

3. **Configurar en Render:**
   - Opción A: Usar Blueprint (detecta render.yaml automáticamente)
   - Opción B: Configuración manual siguiendo DEPLOYMENT_INSTRUCTIONS.md

4. **Verificar deployment:**
   ```bash
   curl https://tu-url/api/auth/register -X POST \
     -H "Content-Type: application/json" \
     -d '{"login":"test","pswd":"test123","name":"Test","email":"test@test.com"}'
   ```

## Notas Técnicas

- El código ahora detecta automáticamente si está en Vercel (serverless) o Render (tradicional)
- En Vercel, no se ejecuta `app.listen()`, solo se exporta el handler
- En Render, se ejecuta como servidor tradicional con `npm start`
- La base de datos se inicializa solo una vez, no en cada request
- SSL se activa automáticamente en ambientes cloud
