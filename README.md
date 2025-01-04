# Control de Gastos Personales

## Descripción
Control de Gastos Personales es una aplicación web diseñada para ayudarte a gestionar tus finanzas de manera eficiente. Permite registrar ingresos y gastos, categorizar transacciones, y generar reportes en diferentes formatos.

## Demo en vivo

Puedes acceder a una versión en vivo de la aplicación aquí: [Control de Gastos Personales](https://control-de-gastos-personales.vercel.app/)

## Características

- **Registro de Transacciones**: Añade ingresos y gastos con facilidad.
- **Categorías Personalizables**: Crea y gestiona tus propias categorías.
- **Historial de Transacciones**: Visualiza y filtra tu historial de transacciones.
- **Transferencias entre Categorías**: Realiza transferencias entre diferentes categorías.
- **Exportación de Datos**: Exporta tus datos en formatos Excel, PDF y JSON.
- **Modo Oscuro**: Interfaz adaptable a modo oscuro.
- **Alta Contraste**: Soporte para modo de alto contraste.
- **Optimización Móvil**: Interfaz optimizada para dispositivos móviles.

## Instalación
1. Clona el repositorio:
    ```bash
    git clone https://github.com/tu-usuario/control-de-gastos-personales.git
    ```
2. Navega al directorio del proyecto:
    ```bash
    cd control-de-gastos-personales
    ```
3. Abre `index.html` en tu navegador preferido.

## Uso
1. **Añadir Transacción**: Completa el formulario de nueva transacción y haz clic en "Agregar Transacción".
2. **Transferir entre Categorías**: Haz clic en "Transferir entre Categorías", completa el formulario y haz clic en "Realizar Transferencia".
3. **Exportar Datos**: Utiliza los botones de exportación para guardar tus datos en el formato deseado.
4. **Importar Datos**: Haz clic en "Importar datos" y selecciona un archivo JSON para cargar tus datos.

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

