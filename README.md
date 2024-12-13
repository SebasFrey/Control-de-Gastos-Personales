# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera.

## Demo en vivo


Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo y categoría.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx).
- Exportar un informe en formato PDF.
- Exportar todos los datos (transacciones y categorías) en formato JSON.
- Importar datos desde un archivo JSON previamente exportado.
- Modo oscuro para mejor visualización en entornos con poca luz.
- Diseño responsivo para una óptima visualización en dispositivos móviles y de escritorio.

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
2. Use el formulario para agregar nuevas transacciones.
3. Vea el resumen financiero en la sección central.
4. Utilice los filtros para ver transacciones específicas.
5. Haga clic en el icono de papelera junto a una transacción para eliminarla.
6. Use los botones de exportación para descargar los datos en Excel, PDF o JSON.
7. Use el botón de importación para cargar datos desde un archivo JSON.
8. Cambie entre modo claro y oscuro con el botón en la esquina superior derecha.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo.
- `script.js`: Lógica de JavaScript para la funcionalidad de la aplicación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Mejoras recientes

- Despliegue de la aplicación en Vercel
- Implementación de exportación de datos a JSON para respaldo.
- Adición de funcionalidad para importar datos desde archivos JSON.
- Mejora en la capitalización de texto en toda la aplicación.
- Optimización del diseño para dispositivos móviles.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.
