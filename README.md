# Asistente Financiero Personal con IA - América Latina

Una aplicación web integral que combina las mejores características de aplicaciones financieras tradicionales con un chatbot conversacional inteligente, diseñada específicamente para usuarios de América Latina.

## 🎯 Propósito

El Asistente Financiero Personal permite a los usuarios gestionar sus finanzas a través de una interfaz conversacional donde ingresan manualmente gastos e ingresos. El chatbot, integrado con un dashboard personalizado, analiza estos datos para ofrecer recomendaciones contextuales, educación financiera y retos gamificados, todo con un tono profesional pero accesible, adaptado al contexto económico de América Latina.

## ✨ Características Principales

### 🤖 Chatbot Conversacional Inteligente
- **Entrada manual vía chat**: Los usuarios ingresan gastos e ingresos directamente en el chat (ej: "Gasté $50 en comida")
- **Procesamiento inteligente**: La IA parsea y categoriza automáticamente las transacciones
- **Recomendaciones personalizadas**: Análisis contextual basado en patrones de gasto
- **Tono adaptado a Latam**: Español estándar sin jerga local ni idiomas indígenas

### 📊 Dashboard Financiero Interactivo
- **Resumen visual**: Gráficos de gastos por categoría y tendencias temporales
- **Análisis en tiempo real**: Estadísticas actualizadas automáticamente
- **Integración IA-dashboard**: La IA lee datos del dashboard para personalizar respuestas
- **Alertas inteligentes**: Notificaciones basadas en patrones de gasto

### 🎯 Sistema de Metas y Retos
- **Metas personalizadas**: Creación y seguimiento de objetivos financieros
- **Retos gamificados**: Desafíos semanales para motivar el ahorro
- **Progreso visual**: Barras de progreso y estadísticas de avance
- **Recomendaciones de IA**: Sugerencias personalizadas para alcanzar metas

### 🎨 Experiencia de Usuario
- **Interfaz minimalista**: Tres pantallas principales accesibles desde navegación inferior
- **Animaciones suaves**: Transiciones fluidas con Framer Motion
- **Diseño responsivo**: Optimizado para móviles y tablets
- **Accesibilidad**: Cumple con estándares WCAG 2.1

## 🚀 Tecnologías Utilizadas

- **Frontend**: React 18, Vite
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Estado**: React Context API
- **Navegación**: React Router DOM

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd asistente-financiero-latam
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes de la interfaz
│   ├── ChatbotScreen.jsx    # Pantalla principal del chatbot
│   ├── DashboardScreen.jsx  # Dashboard financiero
│   ├── GoalsScreen.jsx      # Gestión de metas y retos
│   └── Navigation.jsx       # Navegación inferior
├── context/            # Contextos de React
│   ├── FinancialDataContext.jsx  # Estado de datos financieros
│   └── ChatContext.jsx           # Estado del chat y IA
├── App.jsx             # Componente principal
├── main.jsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 💡 Uso de la Aplicación

### 1. Chatbot (Pantalla Principal)
- **Ingresar gastos**: "Gasté $30 en transporte"
- **Registrar ingresos**: "Recibí $500 de mi trabajo"
- **Consultar presupuesto**: "¿Cómo está mi presupuesto?"
- **Crear metas**: "Quiero ahorrar $1000"

### 2. Dashboard
- **Resumen financiero**: Ingresos, gastos y ahorros del mes
- **Gráficos interactivos**: Distribución de gastos por categoría
- **Tendencias semanales**: Línea de tiempo de ingresos vs gastos
- **Recomendaciones IA**: Botones para consultar al asistente

### 3. Metas y Retos
- **Crear metas**: Establecer objetivos de ahorro
- **Seguir progreso**: Barras de progreso visuales
- **Participar en retos**: Desafíos semanales gamificados
- **Consejos personalizados**: Recomendaciones de la IA

## 🎨 Características de Diseño

### Paleta de Colores
- **Primario**: Verde (#34D399) - Representa crecimiento y éxito financiero
- **Secundario**: Grises neutros - Para texto y elementos de interfaz
- **Categorías**: Colores distintivos para cada tipo de gasto

### Tipografía
- **Fuente**: Inter - Moderna y legible
- **Jerarquía**: Títulos, subtítulos y texto de cuerpo claramente diferenciados

### Animaciones
- **Entrada**: Fade-in y slide-up para elementos
- **Interacciones**: Hover y tap effects
- **Transiciones**: Suaves entre pantallas

## 🔧 Configuración Avanzada

### Personalización de Categorías
Las categorías de gastos se pueden modificar en `FinancialDataContext.jsx`:

```javascript
categories: {
  comida: { name: 'Comida', color: '#FF6B6B', icon: '🍽️' },
  transporte: { name: 'Transporte', color: '#4ECDC4', icon: '🚗' },
  // Agregar más categorías aquí
}
```

### Configuración de IA
El comportamiento del chatbot se puede personalizar en `ChatContext.jsx`:

```javascript
// Modificar patrones de reconocimiento
const transactionMatch = message.match(/(?:gasté|gaste|gasté|pagué|pague|pagué)\s*\$?(\d+(?:\.\d+)?)\s*(?:en|por|de)\s*(.+)/i)
```

## 📱 Responsive Design

La aplicación está optimizada para:
- **Móviles**: Navegación inferior, botones táctiles grandes
- **Tablets**: Layout adaptativo, gráficos responsivos
- **Desktop**: Experiencia completa con todas las funcionalidades

## 🔒 Privacidad y Datos

- **Almacenamiento local**: Todos los datos se guardan en localStorage del navegador
- **Sin servidor**: No se envían datos a servidores externos
- **Procesamiento local**: La IA funciona completamente en el cliente

## 🚀 Despliegue

### Build para Producción
```bash
npm run build
```

### Servir Build
```bash
npm run preview
```

### Despliegue en Vercel/Netlify
1. Conectar repositorio
2. Configurar build command: `npm run build`
3. Configurar output directory: `dist`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas sobre el proyecto:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

## 🔮 Roadmap

### Próximas Características
- [ ] Exportación de datos a PDF/Excel
- [ ] Integración con APIs bancarias (opcional)
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Múltiples monedas
- [ ] Backup en la nube
- [ ] Análisis de tendencias avanzado
- [ ] Comunidad de usuarios

---

**Desarrollado con ❤️ para América Latina**