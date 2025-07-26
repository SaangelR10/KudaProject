# 🤖 Configuración Completa de Dialogflow para FinBot Pro

## 🚀 **Paso 1: Configurar Google Cloud**

### 1.1 Crear Proyecto en Google Cloud
1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Anota el **Project ID** (lo necesitarás después)

### 1.2 Habilitar APIs
1. Ve a "APIs & Services" > "Library"
2. Busca y habilita:
   - **Dialogflow API**
   - **Cloud Natural Language API** (opcional)

### 1.3 Crear Service Account
1. Ve a "APIs & Services" > "Credentials"
2. Haz clic en "Create Credentials" > "Service Account"
3. Dale un nombre como "dialogflow-service"
4. Asigna el rol "Dialogflow API Admin"
5. Crea y descarga el archivo JSON de credenciales

## 🎯 **Paso 2: Configurar Dialogflow**

### 2.1 Crear Agente
1. Ve a [dialogflow.cloud.google.com](https://dialogflow.cloud.google.com)
2. Selecciona tu proyecto de Google Cloud
3. Crea un nuevo agente:
   - **Nombre**: FinBot Pro
   - **Idioma**: Español
   - **Zona horaria**: Tu zona horaria

### 2.2 Configurar Intents (Intenciones)

#### **Intent: registrar_gasto**
```
Training phrases:
- "Gasté $50 en comida"
- "Pagué $30 de transporte"
- "Compré algo por $25"
- "Gaste 100 pesos en entretenimiento"
- "Gasté dinero en ropa"
- "Pagué la renta"

Parameters:
- @sys.number (amount)
- @categoria_gasto (category)
- @sys.any (description)

Response:
"Registré tu gasto de ${{amount}} en {{category}}. ¿Te gustaría que analice este gasto?"
```

#### **Intent: registrar_ingreso**
```
Training phrases:
- "Recibí $500 de mi trabajo"
- "Me pagaron $800"
- "Ingresé $300"
- "Cobré mi sueldo de $1200"
- "Recibí dinero de freelance"
- "Me pagaron por un proyecto"

Parameters:
- @sys.number (amount)
- @fuente_ingreso (source)
- @sys.any (description)

Response:
"¡Excelente! Registré tu ingreso de ${{amount}} de {{source}}. ¿Quieres que actualice tu presupuesto?"
```

#### **Intent: consultar_presupuesto**
```
Training phrases:
- "¿Cómo está mi presupuesto?"
- "Quiero ver mi presupuesto"
- "Estado de mis finanzas"
- "¿Cuánto he gastado?"
- "Muéstrame mi balance"
- "¿Cómo van mis ahorros?"

Response:
"Te muestro tu resumen financiero actual..."
```

#### **Intent: crear_meta_ahorro**
```
Training phrases:
- "Quiero ahorrar $1000"
- "Crear meta de ahorro"
- "Meta para ahorrar $500"
- "Ahorrar para un viaje"
- "Quiero juntar $2000"
- "Meta financiera"

Parameters:
- @sys.number (amount)
- @sys.any (goal)

Response:
"🎯 ¡Perfecto! Creé una meta para ahorrar ${{amount}} para {{goal}}."
```

#### **Intent: analizar_gastos**
```
Training phrases:
- "Analiza mis gastos"
- "¿En qué gasto más?"
- "Revisa mis gastos"
- "Análisis de gastos"
- "¿Cómo están mis gastos?"

Response:
"📊 Te muestro el análisis de tus gastos..."
```

#### **Intent: consejos_ahorro**
```
Training phrases:
- "Dame consejos de ahorro"
- "¿Cómo puedo ahorrar más?"
- "Consejos financieros"
- "Ayuda para ahorrar"
- "Tips de ahorro"

Response:
"💡 Aquí tienes consejos personalizados para mejorar tu ahorro..."
```

### 2.3 Configurar Entidades

#### **Entidad: @categoria_gasto**
```
Values:
- comida
- transporte
- entretenimiento
- salud
- educacion
- vivienda
- ropa
- otros
```

#### **Entidad: @fuente_ingreso**
```
Values:
- trabajo
- freelance
- inversiones
- regalo
- otros
```

## 🔧 **Paso 3: Configurar Variables de Entorno**

### 3.1 Crear archivo .env
```bash
# En la raíz de tu proyecto
cp .env.example .env
```

### 3.2 Configurar variables
```bash
# .env
REACT_APP_DIALOGFLOW_PROJECT_ID=tu-project-id-aqui
REACT_APP_DIALOGFLOW_ACCESS_TOKEN=tu-access-token-aqui
REACT_APP_ENABLE_DIALOGFLOW=true
```

### 3.3 Obtener Access Token
1. Ve a Google Cloud Console
2. "APIs & Services" > "Credentials"
3. Crea una nueva API Key o usa el Service Account
4. Para Service Account, genera un JWT token

## 🧪 **Paso 4: Probar la Integración**

### 4.1 Mensajes de prueba
```
✅ "Gasté $50 en comida"
✅ "Recibí $500 de mi trabajo"
✅ "¿Cómo está mi presupuesto?"
✅ "Quiero ahorrar $1000"
✅ "Analiza mis gastos"
✅ "Dame consejos de ahorro"
```

### 4.2 Verificar respuestas
- Las transacciones se registran automáticamente
- Los datos se actualizan en el Dashboard
- Las metas se crean automáticamente
- Las respuestas son contextuales

## 🔒 **Paso 5: Seguridad**

### 5.1 Proteger credenciales
- Nunca subas el archivo .env a Git
- Usa variables de entorno en producción
- Rota las API keys regularmente

### 5.2 Rate Limiting
- Dialogflow tiene límites de requests
- Implementa cache si es necesario
- Maneja errores gracefully

## 📊 **Paso 6: Monitoreo**

### 6.1 Logs de Dialogflow
- Revisa los logs en Google Cloud Console
- Monitorea el uso de la API
- Verifica la precisión de las intenciones

### 6.2 Métricas importantes
- Requests por minuto
- Precisión de detección de intenciones
- Tiempo de respuesta
- Errores de API

## 🚀 **Paso 7: Despliegue**

### 7.1 En Render
1. Agrega las variables de entorno en Render
2. Configura el build con las variables
3. Verifica que la API funcione en producción

### 7.2 Variables de entorno en Render
```
REACT_APP_DIALOGFLOW_PROJECT_ID=tu-project-id
REACT_APP_DIALOGFLOW_ACCESS_TOKEN=tu-token
REACT_APP_ENABLE_DIALOGFLOW=true
```

## 🎯 **Funcionalidades Implementadas**

### ✅ **Registro Automático**
- Gastos con categorización
- Ingresos con fuente
- Metas de ahorro

### ✅ **Análisis Inteligente**
- Consultas de presupuesto
- Análisis de gastos
- Consejos personalizados

### ✅ **Integración Completa**
- Contexto financiero
- Respuestas dinámicas
- Acciones automáticas

## 🔧 **Solución de Problemas**

### Error: "Dialogflow API error"
- Verifica el Project ID
- Confirma que la API esté habilitada
- Revisa las credenciales

### Error: "No entendí el mensaje"
- Agrega más training phrases
- Revisa la configuración de entidades
- Verifica el idioma del agente

### Error: "Access token invalid"
- Regenera el token
- Verifica la expiración
- Confirma los permisos

## 📈 **Próximos Pasos**

1. **Entrenar el modelo** con más ejemplos
2. **Agregar más intenciones** específicas
3. **Implementar webhooks** para respuestas dinámicas
4. **Agregar análisis de sentimiento**
5. **Integrar con más servicios** financieros

¿Necesitas ayuda con algún paso específico de la configuración?