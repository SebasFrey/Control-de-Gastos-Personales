# Control de Gastos Personales

## Descripción
Control de Gastos Personales es una aplicación web diseñada para ayudarte a gestionar tus finanzas de manera eficiente. Permite registrar transacciones, visualizar resúmenes financieros y exportar datos en diferentes formatos.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- Registro de transacciones de ingresos y gastos.
- Visualización de resúmenes financieros por categoría.
- Exportación de datos a Excel, PDF y JSON.
- Importación de datos desde archivos JSON.
- Interfaz optimizada para dispositivos móviles.
- Menú de navegación tipo "hamburguesa" para facilitar la navegación en móviles.

## Actualización 3.5.6
### Mejoras y Cambios
- **Optimización Móvil**: Se mejoró la experiencia móvil ajustando el diseño responsivo y añadiendo un menú de navegación tipo "hamburguesa".
- **Legibilidad**: Se ajustaron los tamaños de fuente y el contraste de colores para mejorar la legibilidad en pantallas pequeñas.
- **Navegación**: Se implementó un menú de navegación tipo "hamburguesa" que se expande al hacer clic, ahorrando espacio en la pantalla.
- **Validaciones**: Se añadieron validaciones en tiempo real para los formularios de transacciones y transferencias.
- **Errores**: Se mejoró el manejo de errores, mostrando mensajes de error en modales y resaltando los campos con errores.

## Uso
1. Registra una nueva transacción en la sección "Nueva Transacción".
2. Visualiza el resumen financiero en la sección "Resumen Financiero".
3. Consulta el historial de transacciones en la sección "Historial de Transacciones".
4. Utiliza el menú de navegación para moverte entre las secciones.

## Estructura del proyecto

- `index.html`: Estructura HTML de la aplicación.
- `css/variables.css`: Variables CSS globales.
- `css/estilos.css`: Estilos CSS para la interfaz de usuario.
- `css/mobile.css`: Estilos CSS específicos para dispositivos móviles.
- `js/main.js`: Punto de entrada principal de la aplicación.
- `js/modules/`: Módulos JavaScript para la lógica de la aplicación.
- `js/utils/`: Utilidades JavaScript.
- `assets/`: Carpeta para imágenes y otros recursos.
- `docs/`: Documentación del proyecto.

## Registro de Cambios

Consulta el archivo `README.md` para más detalles sobre las versiones y cambios recientes.

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
1. Se modularizó el código para mejor mantenimiento.
2. Se implementaron patrones de rendimiento.
3. Se mejoró la accesibilidad general.
4. Se agregaron más pruebas automatizadas.
5. Se optimizó el manejo de estado.

### Próximos Pasos
1. Implementar más validaciones.
2. Mejorar la experiencia móvil.
3. Agregar más pruebas unitarias.
4. Optimizar el rendimiento.
5. Expandir la documentación.

