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
- `index.js`: Inicialización de la aplicación y manejo de eventos.
- `utils.js`: Funciones de utilidad.
- `estadoManager.js`: Manejo del estado y la persistencia.
- `uiManager.js`: Actualización de la interfaz de usuario.
- `eventHandlers.js`: Manejadores de eventos.
- `exportImport.js`: Funciones de exportación e importación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Actualizaciones Recientes

### Actualización 2.1.14
- Modularización del código JavaScript:
  - Se crearon archivos separados para manejar las utilidades (`utils.js`), el estado de la aplicación (`estadoManager.js`), la actualización de la interfaz de usuario (`uiManager.js`), los manejadores de eventos (`eventHandlers.js`) y las funciones de exportación e importación (`exportImport.js`).
  - Se eliminó el archivo `script.js` original después de modularizar las funciones.

### Actualización 2.1.13
- Mejora del mensaje de confirmación al eliminar una transacción:
  - Se mejoró el mensaje de confirmación para proporcionar más detalles sobre la transacción que se va a eliminar.
  - Ahora el mensaje muestra la descripción, monto, tipo, categoría y fecha de la transacción.

### Actualización 2.1.10
- Fijar el header y manejar el scroll:
  - Se ha fijado el header para que permanezca visible al hacer scroll.
  - Se ha agregado una función para manejar el scroll y ocultar/mostrar el header según la dirección del scroll.
  - Se ha ajustado el margen superior del contenido principal para evitar que quede oculto detrás del header fijo.

### Actualización 2.1.9
- Mejorar funcionalidad del modal de transferencia:
  - He agregado los event listeners necesarios para:
    1. Abrir el modal y cargar las categorías disponibles.
    2. Cerrar el modal con el botón de cerrar.
    3. Cerrar el modal al hacer clic fuera del contenido.
    4. Limpiar el formulario cuando se cierra el modal.
  - Ahora el botón de transferencia entre categorías debería funcionar correctamente. Al hacer clic en él:
    - Se abrirá el modal.
    - Se cargarán las categorías disponibles en ambos selectores.
    - Podrás realizar la transferencia.
    - Podrás cerrar el modal tanto con el botón de cerrar como haciendo clic fuera de él.

### Actualización 2.1.8
- Mejorar adaptación a móviles:
  - Se mejoró la adaptación a móviles para que se ajuste correctamente en teléfonos con resolución 468x830.
  - Se ajustaron los estilos de los formularios y las tablas para una mejor visualización en pantallas pequeñas.

### Actualización 2.1.7
- Eliminar viñetas del resumen por categoría:
  - Se eliminó el padding y el list-style de #lista-categoria para eliminar las viñetas.
  - Se mejoró la alineación visual y la estética de la sección de resumen por categoría.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.
>>>>>>> aad49fb6d2cf4fdc08aff9182483d419e27ad6e7
