# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera con herramientas visuales y funciones avanzadas.

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo, categoría y fecha.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría.
- Gráfico circular para visualizar la distribución de gastos.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx).
- Exportar un informe en formato PDF.
- Modo oscuro para mejor visualización en entornos con poca luz.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js para gráficos
- SheetJS para exportación a Excel
- jsPDF para generación de PDF
- Feather Icons para iconos de interfaz

## Cómo usar

1. Abra el archivo `index.html` en su navegador web.
2. Use el formulario en la parte superior izquierda para agregar nuevas transacciones.
3. Vea el resumen financiero y el gráfico de distribución de gastos en la sección central.
4. Utilice los filtros en la sección de historial para ver transacciones específicas.
5. Haga clic en el icono de papelera junto a una transacción para eliminarla.
6. Al seleccionar la categoría "Otro", ingrese un nombre personalizado para la categoría.
7. Utilice el botón "Agregar Nueva Categoría" para crear categorías personalizadas.
8. Use los botones "Exportar a Excel" y "Exportar a PDF" para descargar los datos en los formatos respectivos.
9. Cambie entre modo claro y oscuro con el botón en la esquina superior derecha.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario.
- `script.js`: Lógica de JavaScript para la funcionalidad de la aplicación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Desarrollo futuro

Algunas ideas para mejorar la aplicación en el futuro:

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Implementar transacciones recurrentes.
- Añadir soporte para múltiples cuentas y monedas.
- Crear una versión móvil de la aplicación.
- Implementar un sistema de respaldo en la nube.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abra un issue o realice un pull request con sus sugerencias.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo `LICENSE` para obtener más detalles.

