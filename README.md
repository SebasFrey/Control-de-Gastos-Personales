# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo y categoría
- Transferir fondos entre categorías con validación de saldo disponible
- Editar transacciones existentes:
  - Modificar descripciones
  - Actualizar montos con recálculo automático de saldos
  - Editar fechas y horas de transacciones
- Visualización financiera:
  - Saldo total, ingresos y gastos
  - Resumen por categoría con actualización automática
  - Historial de transacciones organizado por fecha
- Gestión de datos:
  - Almacenamiento local persistente
  - Exportación a Excel (.xlsx), PDF y JSON
  - Importación desde JSON
- Personalización:
  - Categorías personalizables
  - Modo oscuro/claro
  - Diseño responsivo para móviles y escritorio

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SheetJS para exportación a Excel
- jsPDF para generación de PDF
- Feather Icons para iconos de interfaz
- Vercel para el despliegue

## Cómo usar

1. Visita [https://control-de-gastos-personales.vercel.app/](https://control-de-gastos-personales.vercel.app/)
2. Use el formulario para agregar nuevas transacciones
3. Vea el resumen financiero en la sección central
4. Gestione sus transacciones:
   - Icono de lápiz (✏️) para editar descripciones
   - Icono de moneda (💲) para modificar montos
   - Icono de calendario (📅) para cambiar fechas
   - Icono de papelera (🗑️) para eliminar
5. Utilice "Transferir entre Categorías" para mover fondos
6. Exporte/Importe sus datos según necesite
7. Alterne entre modo claro/oscuro con el botón superior

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación
- `estilos.css`: Estilos CSS y diseño responsivo
- `script.js`: Lógica de JavaScript y funcionalidades
- `README.md`: Documentación del proyecto

## Historial de versiones

### v1.35.0 (Actual)
- Simplificación de la interfaz:
  - Eliminada la sección de filtros de transacciones
  - Mejorada la claridad visual
  - Optimizado el rendimiento
  - Simplificada la experiencia de usuario

### v1.34.3
- Mejoras en la visualización de fechas:
  - Agregado formato de hora a las fechas de transacciones
  - Corrección en la persistencia de fechas y horas
  - Mejora en la presentación del formato fecha/hora
  - Optimización del manejo de zonas horarias

### v1.34.2
- Corrección crítica de funciones de edición:
  - Reparado completamente el sistema de edición de transacciones
  - Implementada identificación precisa de elementos en el DOM
  - Mejorada la lógica de búsqueda de transacciones
  - Optimizado el proceso de actualización de la interfaz
  - Corregida la persistencia de cambios

### v1.34.1
- Correcciones y optimizaciones:
  - Reparada la funcionalidad de edición en la vista por fechas
  - Mejorada la lógica de localización de elementos
  - Optimizado el manejo de cambios de fecha
  - Asegurada la persistencia de datos
  - Mantenida la experiencia de usuario consistente

### v1.34.0
- Nueva organización del historial de transacciones:
  - Sistema de listas desplegables agrupadas por fecha
  - Visualización expandida automática del día actual
  - Indicadores visuales de expansión/colapso
  - Contador de transacciones por día
  - Mejor organización visual de la información

### Versiones anteriores
- Implementación de transferencias entre categorías
- Sistema de edición de montos y descripciones
- Exportación e importación de datos
- Modo oscuro y diseño responsivo
- Gestión de categorías personalizadas

## Desarrollo futuro

- Sistema de autenticación de usuarios
- Presupuestos y metas de ahorro
- Soporte para múltiples cuentas y monedas
- Sistema de respaldo en la nube
- Notificaciones y recordatorios
- Gráficos y análisis avanzados

