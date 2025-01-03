import { validarFormulario, mostrarMensaje } from './utils.js';
import { AppState, EstadoManager } from './estadoManager.js';
import { actualizarSaldo, actualizarResumenCategoria, actualizarListaTransacciones, actualizarSelectCategorias } from './uiManager.js';

export const handleSubmitFormulario = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const errores = validarFormulario(formData);

    if (Object.keys(errores).length > 0) {
        Object.entries(errores).forEach(([campo, mensaje]) => {
            const elementoError = document.getElementById(`error-${campo}`);
            if (elementoError) {
                elementoError.textContent = mensaje;
                elementoError.setAttribute('role', 'alert');
                elementoError.setAttribute('aria-live', 'assertive');
            }
        });
        return;
    }

    // Limpiar mensajes de error previos
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.textContent = '';

        el.removeAttribute('role');
        el.removeAttribute('aria-live');
    });

    try {
        let categoria = formData.get('categoria');
        if (categoria === 'otro') {
            categoria = formData.get('otra-categoria').trim().toLowerCase();
            if (!AppState.categorias.includes(categoria)) {
                AppState.categorias.push(categoria);
            }
        }

        const nuevaTransaccion = {
            descripcion: formData.get('descripcion') || null,
            monto: parseFloat(formData.get('monto')),
            tipo: formData.get('tipo'),
            categoria,
            fecha: new Date().toISOString()
        };

        AppState.transacciones.push(nuevaTransaccion);
        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();

        e.target.reset();
        document.getElementById('contenedor-otra-categoria').style.display = 'none';
        mostrarMensaje('Transacción agregada con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al agregar la transacción', 'error');
        console.error('Error en submit:', error);
    }
};

export const handleCategoriaChange = (e) => {
    const contenedorOtraCategoria = document.getElementById('contenedor-otra-categoria');
    contenedorOtraCategoria.style.display = e.target.value === 'otro' ? 'block' : 'none';
};

