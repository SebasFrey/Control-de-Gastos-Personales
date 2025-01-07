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

## Actualización 3.6.0
### Mejoras y Cambios
- **Backend**: Se realizaron cambios importantes en la estructura y lógica del backend para mejorar el rendimiento y la escalabilidad.
- **Exportación a PDF**: Se corrigió la funcionalidad de exportación a PDF para asegurar que los datos se exporten correctamente.
- **Mejoras de legibilidad**: Ajustes en los tamaños de fuente y el contraste de colores para mejorar la legibilidad en pantallas pequeñas.

## Uso
1. Registra una nueva transacción en la sección "Nueva Transacción".
2. Visualiza el resumen financiero en la sección "Resumen Financiero".
3. Consulta el historial de transacciones en la sección "Historial de Transacciones".
4. Utiliza el menú de navegación para moverte entre las secciones.

## Estructura del proyecto

```plaintext
expense-tracker/
├── index.html
├── css/
│   ├── variables.css      # Variables CSS globales
│   ├── estilos.css        # Estilos base
│   └── mobile.css         # Optimizaciones móviles
├── js/
│   ├── main.js            # Punto de entrada
│   ├── modules/
│   │   ├── estado.js      # Gestión del estado
│   │   ├── ui.js          # UI base
│   │   ├── mobile-ui.js   # UI móvil
│   │   ├── historial.js   # Gestión del historial
│   │   ├── edicion.js     # Gestión de edición
│   │   └── transferencias.js # Gestión de transferencias
│   └── utils/
│       ├── formatters.js  # Utilidades de formato
│       ├── validators.js  # Validaciones
│       └── mobile-utils.js # Utilidades móviles
```

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

