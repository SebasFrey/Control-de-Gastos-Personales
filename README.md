# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo y categoría.
- Transferir fondos entre categorías con validación de saldo disponible.
- Editar la descripción y el monto de transacciones existentes.
- Actualización automática de saldos al editar montos de transacciones.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría, con saldos actualizados automáticamente.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx), PDF y JSON.
- Importar datos desde un archivo JSON previamente exportado.
- Modo oscuro mejorado para mejor visualización en entornos con poca luz.
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
3. Vea el resumen financiero en la sección central, incluyendo los saldos por categoría.
4. Utilice el botón "Transferir entre Categorías" para mover fondos entre categorías.
5. Utilice los filtros para ver transacciones específicas.
6. Haga clic en el icono de edición (lápiz) junto a una transacción para modificar su descripción.
7. Haga clic en el icono de moneda ($) junto a una transacción para modificar su monto.
8. Haga clic en el icono de papelera junto a una transacción para eliminarla.
9. Use los botones de exportación para descargar los datos en Excel, PDF o JSON.
10. Use el botón de importación para cargar datos desde un archivo JSON.
11. Cambie entre modo claro y oscuro con el botón en la esquina superior derecha.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo y modo oscuro mejorado.
- `script.js`: Lógica de JavaScript para la funcionalidad de la aplicación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Mejoras recientes

- Implementación de transferencias entre categorías con validación de saldos.
- Corrección del problema de duplicación del símbolo "$" en el resumen de categorías.
- Implementación de la edición de montos en transacciones existentes.
- Actualización automática de saldos financieros y por categoría al editar montos.
- Implementación de la actualización automática de saldos por categoría.
- Implementación de la funcionalidad para editar descripciones de transacciones.
- Mejora en la paleta de colores para el modo oscuro.
- Optimización del diseño para dispositivos móviles.
- Implementación de exportación de datos a JSON para respaldo.
- Adición de funcionalidad para importar datos desde archivos JSON.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.
