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
- `css/estilos.css`: Estilos CSS para la interfaz de usuario, incluyendo diseño responsivo.
- `js/script.js`: Manejo de la lógica de la aplicación y eventos.
- `assets/`: Carpeta para imágenes y otros recursos.
- `data/`: Carpeta para archivos JSON o de configuración.

## Registro de Cambios

### Versión 3.1.0

#### Mejoras en Transferencias entre Categorías
- Implementadas validaciones estrictas para transferencias
- Verificación de saldo suficiente en categoría origen
- Validación de categorías diferentes
- Mensajes de error más descriptivos y claros
- Actualización en tiempo real del estado

#### Mejoras en el Historial de Transacciones
- Implementado despliegue dinámico de secciones
- Cálculo automático de altura usando scrollHeight
- Transiciones suaves en expansión/colapso
- Mejor manejo de memoria y rendimiento
- Corrección de problemas de reflow

#### Mejoras en la Edición de Transacciones
- Validación en tiempo real de campos editables
- Mejor experiencia de usuario en la edición
- Actualización consistente entre DOM y estado
- Nuevas validaciones para montos y fechas
- Mensajes de error contextuales

### Pruebas Realizadas

#### Transferencias
- [✓] Validación de categorías diferentes
- [✓] Validación de saldo suficiente
- [✓] Mensajes de error claros
- [✓] Actualización correcta del estado
- [✓] Persistencia de datos

#### Historial
- [✓] Despliegue suave de secciones
- [✓] Altura calculada correctamente
- [✓] Rendimiento en múltiples secciones
- [✓] Comportamiento responsive
- [✓] Accesibilidad

#### Edición
- [✓] Validación en tiempo real
- [✓] Guardado correcto de cambios
- [✓] Actualización de UI
- [✓] Manejo de errores
- [✓] Experiencia de usuario

### Notas de Implementación
1. Se modularizó el código para mejor mantenimiento
2. Se implementaron patrones de rendimiento
3. Se mejoró la accesibilidad general
4. Se agregaron más pruebas automatizadas
5. Se optimizó el manejo de estado

### Próximos Pasos
1. Implementar más validaciones
2. Mejorar la experiencia móvil
3. Agregar más pruebas unitarias
4. Optimizar el rendimiento
5. Expandir la documentación

## Desarrollo futuro

- Implementar un sistema de autenticación de usuarios.
- Agregar la opción de crear presupuestos y metas de ahorro.
- Añadir soporte para múltiples cuentas y monedas.
- Implementar un sistema de respaldo en la nube.

