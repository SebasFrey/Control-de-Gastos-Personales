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
  - Diseño responsivo para móviles y escritorio
  - Interfaz minimalista en blanco y negro

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

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación
- `estilos.css`: Estilos CSS y diseño responsivo
- `script.js`: Lógica de JavaScript y funcionalidades
- `README.md`: Documentación del proyecto

## Guía de estilos

### Colores
- **Principal**: Negro (#000000)
- **Secundario**: Gris (#666666)
- **Fondo**: Blanco (#FFFFFF)
- **Acento**: Gris claro (#E0E0E0)
- **Texto**: Negro (#000000)

### Tipografía
- **Familia**: Roboto
- **Pesos**: 300 (Light), 400 (Regular), 700 (Bold)
- **Tamaños**:
  - Títulos principales: 1.5rem
  - Subtítulos: 1.25rem
  - Texto general: 1rem
  - Texto pequeño: 0.9rem

### Espaciado
- **Márgenes**: 1rem (16px)
- **Padding**: 0.75rem - 1rem (12px - 16px)
- **Gap**: 0.5rem - 1rem (8px - 16px)

### Bordes y sombras
- **Radio de borde**: 4px
- **Sombras**: 0 2px 4px rgba(0, 0, 0, 0.1)

## Historial de versiones

### v1.38.0 (Actual)
- Correcciones y mejoras en la importación de datos:
  - Implementado indicador visual de carga durante la importación
  - Mejorada la validación de datos importados
  - Optimizado el proceso de recálculo de saldos
  - Corregida la actualización inmediata de la interfaz tras importación
  - Añadido manejo de errores más robusto
- Mejoras en la experiencia de usuario:
  - Feedback visual mejorado durante operaciones
  - Mayor estabilidad en la gestión de datos
  - Optimización del rendimiento general

### v1.37.0
- Gestión mejorada de categorías:
  - Añadida opción de eliminar categorías
  - Implementada categoría "Sin clasificar" para transacciones huérfanas
  - Mejorada la transferencia entre categorías
- Mejoras en la interfaz:
  - Optimizada la responsividad en dispositivos móviles
  - Eliminada temporalmente la funcionalidad de modo oscuro
  - Mejorada la presentación de fechas en el historial
- Correcciones:
  - Solucionados problemas de visualización en móviles
  - Mejorada la gestión de estados en edición de transacciones

[Versiones anteriores omitidas por brevedad]

## Desarrollo futuro

### Próximas características
- Sistema de autenticación de usuarios
- Presupuestos y metas de ahorro
- Soporte para múltiples cuentas y monedas
- Sistema de respaldo en la nube
- Notificaciones y recordatorios
- Gráficos y análisis avanzados

### Mejoras planificadas
- Reimplementación del modo oscuro con nuevo diseño
- Sistema de respaldo automático
- Filtros avanzados por fecha y categoría
- Gráficos estadísticos
- Presupuestos por categoría
- Sistema de metas de ahorro

