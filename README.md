# Control de Gastos Personales

Esta aplicación web permite a los usuarios llevar un registro detallado de sus ingresos y gastos personales, proporcionando una visión general de su situación financiera con herramientas visuales y funciones avanzadas.

## Características

- Agregar transacciones (ingresos y gastos) con descripción, monto, tipo, categoría y fecha.
- Visualizar el saldo total, total de ingresos y total de gastos.
- Ver un resumen de transacciones por categoría.
- Filtrar transacciones por tipo, categoría y rango de fechas.
- Eliminar transacciones individuales.
- Almacenamiento local de datos para persistencia entre sesiones.
- Personalizar el nombre de la categoría "Otro" al agregar una transacción.
- Agregar nuevas categorías personalizadas.
- Exportar todas las transacciones en formato Excel (.xlsx).
- Exportar un informe en formato PDF.
- Modo oscuro para mejor visualización en entornos con poca luz.
- Resumen de gastos e ingresos diarios, semanales y mensuales.
- Diseño responsivo para una óptima visualización en dispositivos móviles y de escritorio.
- Tabla de transacciones mejorada para una visualización más clara y ordenada.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- SheetJS para exportación a Excel
- jsPDF para generación de PDF
- Feather Icons para iconos de interfaz

## Cómo usar

1. Abra el archivo `index.html` en su navegador web.
2. Use el formulario en la parte superior para agregar nuevas transacciones.
3. Vea el resumen financiero en la sección central.
4. Utilice los filtros en la sección de historial para ver transacciones específicas.
5. Haga clic en el icono de papelera junto a una transacción para eliminarla.
6. Al seleccionar la categoría "Otro", ingrese un nombre personalizado para la categoría.
7. Utilice el botón "Agregar Nueva Categoría" para crear categorías personalizadas.
8. Use los botones "Exportar a Excel" y "Exportar a PDF" para descargar los datos en los formatos respectivos.
9. Cambie entre modo claro y oscuro con el botón en la esquina superior derecha.
10. Consulte los resúmenes diarios, semanales y mensuales en la sección correspondiente.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo.
- `script.js`: Lógica de JavaScript para la funcionalidad de la aplicación.
- `README.md`: Este archivo, que proporciona información sobre el proyecto.

## Mejoras recientes

- Optimización del diseño para dispositivos móviles.
- Corrección de problemas de desbordamiento y espaciado en pantallas pequeñas.
- Mejora en la visualización del encabezado en dispositivos móviles.
- Ajustes en el tamaño de fuente y espaciado para mejorar la legibilidad en pantallas pequeñas.

## Desarrollo futuro

Algunas ideas para mejorar la aplicación en el futuro:

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Implementar transacciones recurrentes.
- Añadir soporte para múltiples cuentas y monedas.
- Crear una versión móvil nativa de la aplicación.
- Implementar un sistema de respaldo en la nube.
- Añadir gráficos interactivos para visualizar tendencias de gastos e ingresos.
- Implementar notificaciones para recordatorios de pagos o cuando se exceden los límites de gastos.

## Contribuciones

Las contribuciones son bienvenidas. Por favor, abra un issue o realice un pull request con sus sugerencias.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulte el archivo `LICENSE` para obtener más detalles.

