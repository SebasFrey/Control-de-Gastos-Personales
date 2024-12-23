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
  - Editar fechas de transacciones
- Visualización financiera:
  - Saldo total, ingresos y gastos
  - Resumen por categoría con actualización automática
  - Historial de transacciones con filtros
- Gestión de datos:
  - Almacenamiento local persistente
  - Exportación a Excel (.xlsx), PDF y JSON
  - Importación desde JSON
  - Filtros por tipo, categoría y rango de fechas
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
6. Aplique filtros para visualizar transacciones específicas
7. Exporte/Importe sus datos según necesite
8. Alterne entre modo claro/oscuro con el botón superior

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación
- `estilos.css`: Estilos CSS y diseño responsivo
- `script.js`: Lógica de JavaScript y funcionalidades
- `README.md`: Documentación del proyecto

## Historial de versiones

### v1.33.0 (Actual)
- Nueva funcionalidad de edición de fechas:
  - Editor de fechas integrado en la tabla de transacciones
  - Interfaz intuitiva con selector de calendario
  - Validación de fechas y actualización inmediata
  - Persistencia automática de cambios

### v1.32.0
- Reorganización de la interfaz de botones:
  - Agrupación funcional mejorada
  - Separadores visuales claros
  - Optimización del diseño responsivo

### v1.31.0
- Correcciones y mejoras:
  - Eliminación de duplicación en botones
  - Mejora en la organización horizontal
  - Optimización de controles

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
