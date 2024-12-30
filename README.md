# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo y categoría.
- Editar la descripción y el monto de transacciones existentes.
- Actualización automática de saldos al editar montos de transacciones.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría, con saldos actualizados automáticamente.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx), PDF y JSON con nombres de archivo mejorados ("Control De Gastos Personales").
- Importar datos desde un archivo JSON previamente exportado.
- Diseño responsivo para una óptima visualización en dispositivos móviles y de escritorio.
- Implementación de un diseño "acordeón" en las tablas de historial de transacciones.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SheetJS para exportación a Excel
- jsPDF para generación de PDF
- Feather Icons para iconos de interfaz
- Vercel para el despliegue

## Cómo usar

1. **Visita**: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)
2. **Agregar Transacción**:
    - Completa el formulario de "Nueva Transacción" con el monto, tipo, categoría y descripción opcional.
    - Haz clic en "Agregar Transacción".
3. **Crear Nueva Categoría**:
    - Selecciona "Otro" en el campo de categoría.
    - Ingresa el nombre de la nueva categoría.
4. **Exportar Datos**:
    - Utiliza los botones de exportación para guardar tus datos en formato Excel, PDF o JSON.
5. **Importar Datos**:
    - Haz clic en "Importar datos" y selecciona un archivo JSON con tus datos.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo.
- `script.js`: Lógica de JavaScript para la funcionalidad de la aplicación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Mejoras recientes

- Implementación de la edición de montos en transacciones existentes.
- Actualización automática de saldos financieros y por categoría al editar montos.
- Implementación de la actualización automática de saldos por categoría al agregar o eliminar transacciones.
- Implementación de la funcionalidad para editar descripciones de transacciones.
- Optimización del diseño para dispositivos móviles.
- Implementación de exportación de datos a JSON para respaldo.
- Adición de funcionalidad para importar datos desde archivos JSON.
- Refinado el formato de los nombres de archivos descargables para una presentación más profesional y consistente.
- Optimización de la carga de recursos externos mediante importación dinámica.
- Consolidación de variables CSS duplicadas.
- Implementación de memoización para operaciones de renderizado.
- Mejora de la accesibilidad mediante la actualización de atributos ARIA y ajuste de colores para mejor contraste.
- Adaptación del historial de transacciones para dispositivos móviles, simplificando la tabla y optimizando el scroll horizontal.
- Implementación de un diseño "acordeón" en las tablas de historial de transacciones.
- Eliminación del botón "Agregar Nueva Categoría".
- Mejora en la visibilidad de las transacciones en dispositivos móviles.
- Mejora en la funcionalidad en dispositivos móviles.
- Eliminación del modo oscuro.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.
