import { EstadoManager } from './estado.js';
import { UIManager } from './ui.js';
import { TransactionManager } from './transacciones.js';
import { HistorialManager } from './historial.js';
import { EdicionManager } from './edicion.js';
import { TransferenciasManager } from './transferencias.js';
import { validarFormulario, throttle } from './utilidades.js';
import { validarTransferencia } from './validaciones.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize state
  await EstadoManager.inicializar();

  // Initialize Feather icons
  if (window.feather) {
    requestAnimationFrame(() => {
      feather.replace();
    });
  }

  // Add scroll handler with throttle
  window.addEventListener('scroll', throttle(() => {
    const header = document.querySelector('header');
    const scrollY = window.scrollY;

    requestAnimationFrame(() => {
      header.classList.toggle('hidden', scrollY > 50);
    });
  }, 100), { passive: true });

  // Set up form handlers
  setupFormHandlers();
  setupModalHandlers();

  // Initialize events for historial
  HistorialManager.inicializarEventos();

  // Initialize events for editing
  EdicionManager.inicializarEventosEdicion();
});

function setupFormHandlers() {
  // Main transaction form
  const transactionForm = document.getElementById('formulario-transaccion');
  transactionForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const errores = validarFormulario(formData);

    if (Object.keys(errores).length > 0) {
      Object.entries(errores).forEach(([campo, mensaje]) => {
        const elementoError = document.getElementById(`error-${campo}`);
        if (elementoError) {
          elementoError.textContent = mensaje;
          elementoError.classList.add('visible');
        }
      });
      return;
    }

    const success = await TransactionManager.agregarTransaccion(formData);
    if (success) {
      e.target.reset();
      document.getElementById('contenedor-otra-categoria').style.display = 'none';
    }
  });

  // Category change handler
  const categorySelect = document.getElementById('categoria');
  categorySelect?.addEventListener('change', (e) => {
    const contenedorOtraCategoria = document.getElementById('contenedor-otra-categoria');
    contenedorOtraCategoria.style.display = e.target.value === 'otro' ? 'block' : 'none';
  });
}

function setupModalHandlers() {
  // Transfer modal
  const modalTransfer = document.getElementById('modal-transferencia');
  const openModalBtn = document.getElementById('abrir-modal-transferencia');
  const closeModalBtn = document.getElementById('cerrar-modal-transferencia');
  const transferForm = document.getElementById('formulario-transferencia');

  openModalBtn?.addEventListener('click', () => {
    modalTransfer.classList.remove('hidden');
    updateCategorySelects();
  });

  closeModalBtn?.addEventListener('click', () => {
    modalTransfer.classList.add('hidden');
    transferForm.reset();
  });

  modalTransfer?.addEventListener('click', (e) => {
    if (e.target === modalTransfer) {
      modalTransfer.classList.add('hidden');
      transferForm.reset();
    }
  });

  transferForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { esValido, errores } = validarTransferencia(formData);

    if (!esValido) {
      UIManager.mostrarMensaje(errores.join('\n'), 'error');
      return;
    }

    const success = await TransferenciasManager.realizarTransferencia(formData);
    if (success) {
      modalTransfer.classList.add('hidden');
      e.target.reset();
    }
  });
}

function updateCategorySelects() {
  const selectOrigen = document.getElementById('categoria-origen');
  const selectDestino = document.getElementById('categoria-destino');

  if (!selectOrigen || !selectDestino) return;

  const options = AppState.categorias
    .map(categoria => `
      <option value="${categoria}">
        ${categoria.charAt(0).toUpperCase() + categoria.slice(1)}
      </option>
    `)
    .join('');

  selectOrigen.innerHTML = options;
  selectDestino.innerHTML = options;
}

