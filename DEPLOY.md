# 🚀 Guía de Despliegue en Vercel

## 📋 Requisitos Previos

1. **Cuenta de GitHub**: Tu código debe estar en un repositorio de GitHub
2. **Cuenta de Vercel**: Regístrate en [vercel.com](https://vercel.com)
3. **Proyecto listo**: Asegúrate de que el build funcione localmente

## 🔧 Pasos para Desplegar

### 1. **Preparar el Repositorio**

Asegúrate de que tu proyecto esté en GitHub con estos archivos:

```bash
# Verificar que tienes todos los archivos necesarios
ls -la
```

Archivos esenciales:
- ✅ `package.json`
- ✅ `vite.config.js`
- ✅ `vercel.json`
- ✅ `src/` (código fuente)
- ✅ `index.html`

### 2. **Crear Cuenta en Vercel**

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Conecta tu cuenta de GitHub
4. Autoriza a Vercel para acceder a tus repositorios

### 3. **Importar Proyecto**

1. **Dashboard de Vercel**:
   - Haz clic en "New Project"
   - Selecciona tu repositorio de GitHub

2. **Configuración del Proyecto**:
   ```
   Framework Preset: Vite
   Root Directory: ./
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Variables de Entorno** (si las necesitas):
   - Por ahora no necesitas variables de entorno
   - La app funciona completamente en el cliente

4. **Haz clic en "Deploy"**

### 4. **Configuración Automática**

Vercel detectará automáticamente que es un proyecto Vite y configurará:

- ✅ **Build Command**: `npm run build`
- ✅ **Output Directory**: `dist`
- ✅ **Node.js Version**: Automática
- ✅ **Framework**: Vite

### 5. **Verificar el Despliegue**

Una vez completado el despliegue:

1. **URL de Producción**: `https://tu-proyecto.vercel.app`
2. **Verificar funcionalidad**:
   - Chat funciona correctamente
   - Dashboard muestra datos
   - Navegación entre pantallas
   - Gráficos se renderizan

## 🔄 Despliegues Automáticos

### **Cada vez que hagas push a GitHub**:
- Vercel detectará cambios automáticamente
- Ejecutará `npm run build`
- Desplegará la nueva versión
- URL de preview disponible para cada commit

### **Ramas de desarrollo**:
- `main` → Producción
- `develop` → Preview
- `feature/*` → Preview automático

## 🛠️ Solución de Problemas

### **Error: Build Failed**

1. **Verificar localmente**:
   ```bash
   npm run build
   ```

2. **Revisar logs en Vercel**:
   - Dashboard → Proyecto → Deployments → Ver logs

3. **Problemas comunes**:
   - Dependencias faltantes
   - Errores de sintaxis
   - Variables de entorno no configuradas

### **Error: 404 en Rutas**

Si las rutas no funcionan:

1. **Verificar `vercel.json`**:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. **Verificar React Router**:
   - Asegúrate de que `BrowserRouter` esté configurado

### **Error: Assets no cargan**

1. **Verificar rutas de assets**:
   - Los assets deben estar en `/assets/`
   - Vercel los sirve automáticamente

2. **Cache de navegador**:
   - Hard refresh: `Ctrl+F5` (Windows) o `Cmd+Shift+R` (Mac)

## 📱 Optimizaciones para Producción

### **Performance**

1. **Code Splitting** (opcional):
   ```javascript
   // En vite.config.js
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             charts: ['recharts'],
             animations: ['framer-motion']
           }
         }
       }
     }
   })
   ```

2. **Compresión**:
   - Vercel comprime automáticamente los assets
   - Gzip y Brotli habilitados

### **SEO y Meta Tags**

1. **Verificar `index.html`**:
   ```html
   <title>Asistente Financiero Latam</title>
   <meta name="description" content="Asistente Financiero Personal con IA para América Latina">
   ```

2. **Open Graph** (opcional):
   ```html
   <meta property="og:title" content="Asistente Financiero Latam">
   <meta property="og:description" content="Gestiona tus finanzas con IA">
   <meta property="og:image" content="/og-image.png">
   ```

## 🔒 Seguridad

### **Headers de Seguridad**

Vercel incluye automáticamente:
- ✅ `X-Frame-Options`
- ✅ `X-Content-Type-Options`
- ✅ `Referrer-Policy`

### **HTTPS**
- ✅ Automático en Vercel
- ✅ Certificados SSL gratuitos
- ✅ Redirección automática de HTTP a HTTPS

## 📊 Analytics (Opcional)

### **Vercel Analytics**
1. Dashboard → Proyecto → Analytics
2. Habilitar "Web Analytics"
3. Agregar script a `index.html`:
   ```html
   <script defer src="/_vercel/insights/script.js"></script>
   ```

### **Google Analytics**
1. Crear cuenta en Google Analytics
2. Agregar script a `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

## 🚀 Comandos Útiles

### **Despliegue Manual**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

### **Variables de Entorno**
```bash
# Agregar variable
vercel env add VARIABLE_NAME

# Listar variables
vercel env ls

# Remover variable
vercel env rm VARIABLE_NAME
```

## 📞 Soporte

### **Recursos Útiles**
- [Documentación de Vercel](https://vercel.com/docs)
- [Guía de Vite](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

### **Comunidad**
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/vercel)

---

## 🎉 ¡Tu App Está Lista!

Una vez desplegada, tu Asistente Financiero Personal estará disponible en:
**`https://tu-proyecto.vercel.app`**

### **Próximos Pasos**
1. ✅ Compartir la URL con usuarios
2. ✅ Configurar dominio personalizado (opcional)
3. ✅ Monitorear analytics
4. ✅ Implementar feedback de usuarios

**¡Felicitaciones! Tu aplicación está en producción 🚀**