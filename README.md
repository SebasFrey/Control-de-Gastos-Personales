# Control de Gastos Personales

## Descripción
Control de Gastos Personales es una aplicación web diseñada para ayudarte a gestionar tus finanzas de manera eficiente. Puedes registrar tus ingresos y gastos, categorizarlos y obtener un resumen financiero detallado.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Registro de transacciones (ingresos y gastos).
- Categorización de transacciones.
- Resumen financiero por categoría.
- Exportación de datos a Excel, PDF y JSON.
- Importación de datos desde archivo JSON.
- Transferencia entre categorías.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SheetJS para exportación a Excel
- jsPDF para generación de PDF
- Feather Icons para iconos de interfaz
- Vercel para el despliegue

## Uso
1. Agrega una nueva transacción llenando el formulario y haciendo clic en "Agregar Transacción".
2. Visualiza el resumen financiero y el historial de transacciones.
3. Usa los botones de exportación para guardar tus datos en Excel, PDF o JSON.
4. Importa datos desde un archivo JSON utilizando el botón "Importar datos".
5. Realiza transferencias entre categorías utilizando el botón "Transferir entre Categorías".

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo.
- `script.js`: Manejo de la lógica de la aplicación y eventos.

## Actualizaciones Recientes

### Actualización 3.0.2

- Corregida la funcionalidad para importar datos desde archivos Excel y PDF.
- Mejoras en la validación de formularios para evitar duplicados en categorías personalizadas.
- Corrección de errores menores y mejoras en la interfaz de usuario.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.
