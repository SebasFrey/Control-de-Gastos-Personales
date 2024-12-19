# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo y categoría.
- Editar la descripción y el monto de transacciones existentes.
- Visualización mejorada de valores negativos con signo "-" explícito.
- Actualización automática de saldos al editar montos de transacciones.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría, con saldos actualizados automáticamente.
- Tratamiento consistente de números negativos en todas las visualizaciones.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx), PDF y JSON con nombres de archivo mejorados ("Control De Gastos Personales").
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
4. Los gastos se mostrarán como valores negativos (con signo "-") en rojo.
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

- Implementación de visualización mejorada de valores negativos.
- Tratamiento consistente de números negativos en todas las vistas.
- Implementación de la edición de montos en transacciones existentes.
- Actualización automática de saldos financieros y por categoría al editar montos.
- Implementación de la actualización automática de saldos por categoría al agregar o eliminar transacciones.
- Implementación de la funcionalidad para editar descripciones de transacciones.
- Mejora en la paleta de colores para el modo oscuro.
- Optimización del diseño para dispositivos móviles.
- Implementación de exportación de datos a JSON para respaldo.
- Adición de funcionalidad para importar datos desde archivos JSON.
- Refinado el formato de los nombres de archivos descargables para una presentación más profesional y consistente.

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abra un issue o realice un pull request con sus sugerencias.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo `LICENSE` para obtener más detalles.

