import { EstadoManager } from './estadoManager.js';
import { handleSubmitFormulario, handleCategoriaChange } from './eventHandlers.js';
import { exportarExcel, exportarPDF, exportarJSON, importarJSON, transferirEntreCategorias } from './exportImport.js';
import { resetFeatherCache } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    EstadoManager.inicializar();
    feather.replace();
    resetFeatherCache();

    // Agregar evento de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Formulario principal
    document.getElementById('formulario-transaccion')
        .addEventListener('submit', handleSubmitFormulario);

    document.getElementById('categoria')
        .addEventListener('change', handleCategoriaChange);

    // Botones de exportación
    document.getElementById('exportar-excel')
        .addEventListener('click', exportarExcel);

    document.getElementById('exportar-pdf')
        .addEventListener('click', exportarPDF);

    document.getElementById('exportar-json')
        .addEventListener('click', exportarJSON);

    document.getElementById('importar-json')
        .addEventListener('change', importarJSON);

    // Botones del modal de transferencia
    document.getElementById('abrir-modal-transferencia')
        .addEventListener('click', () => {
            const modal = document.getElementById('modal-transferencia');
            const selectOrigen = document.getElementById('categoria-origen');
            const selectDestino = document.getElementById('categoria-destino');

            // Actualizar las opciones de categorías
            const optionsHTML = AppState.categorias
                .map(categoria => `<option value="${categoria}">${capitalizarPalabras(categoria)}</option>`)
                .join('');

            selectOrigen.innerHTML = optionsHTML;
            selectDestino.innerHTML = optionsHTML;

            modal.classList.remove('hidden');
        });

    document.getElementById('cerrar-modal-transferencia')
        .addEventListener('click', () => {
            document.getElementById('modal-transferencia').classList.add('hidden');
            document.getElementById('formulario-transferencia').reset();
        });

    // Cerrar modal al hacer clic fuera del contenido
    document.getElementById('modal-transferencia').addEventListener('click', (e) => {
        if (e.target.id === 'modal-transferencia') {
            e.target.classList.add('hidden');
            document.getElementById('formulario-transferencia').reset();
        }
    });

    // Delegación de eventos para acciones dinámicas
    document.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const indice = target.dataset.indice;
        if (!indice && !target.classList.contains('boton-eliminar-categoria')) return;

        if (target.classList.contains('boton-eliminar')) {
            await confirmarEliminarTransaccion(indice);
        } else if (target.classList.contains('boton-editar-descripcion')) {
            await editarDescripcion(indice);
        } else if (target.classList.contains('boton-editar-monto')) {
            await editarMonto(indice);
        } else if (target.classList.contains('boton-editar-fecha')) {
            await editarFecha(indice);
        } else if (target.classList.contains('boton-eliminar-categoria')) {
            const categoria = target.dataset.categoria;
            await eliminarCategoria(categoria);
        }
    });

    // Agregar evento para la transferencia entre categorías
    document.getElementById('formulario-transferencia')
        .addEventListener('submit', transferirEntreCategorias);
});
