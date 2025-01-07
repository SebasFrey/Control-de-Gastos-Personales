import { AppState } from '../estado.js';
import { validarFecha, validarMonto } from '../validaciones.js';
import { UIManager } from './ui.js';

export class EdicionManager {
  static async editarTransaccion(indice, campo, valor) {
    try {
      const transaccion = AppState.transacciones[indice];
      if (!transaccion) {
        throw new Error('Transacción no encontrada');
      }


      // Validar el nuevo valor según el campo
      switch (campo) {
        case 'monto':
          if (!validarMonto(valor)) {
            throw new Error('El monto debe ser mayor que 0');
          }
          transaccion.monto = parseFloat(valor);
          break;

        case 'descripcion':
          transaccion.descripcion = valor.trim() || null;
          break;

        case 'fecha':
          if (!validarFecha(valor)) {
            throw new Error('Fecha inválida');
          }
          transaccion.fecha = new Date(valor).toISOString();
          break;

        default:
          throw new Error('Campo no válido');
      }

      // Actualizar estado y UI
      await AppState.guardarCambios();
      UIManager.actualizarHistorial();

      return true;
    } catch (error) {
      UIManager.mostrarMensaje(error.message, 'error');
      return false;
    }
  }

  static inicializarEventosEdicion() {
    document.addEventListener('click', async (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const { accion, indice } = target.dataset;
      if (!accion || !indice) return;

      switch (accion) {
        case 'editar-monto':
          await this.iniciarEdicionMonto(indice);
          break;
        case 'editar-descripcion':
          await this.iniciarEdicionDescripcion(indice);
          break;
        case 'editar-fecha':
          await this.iniciarEdicionFecha(indice);
          break;
      }
    });
  }

  static async iniciarEdicionMonto(indice) {
    const fila = document.querySelector(`tr[data-indice="${indice}"]`);
    const montoCell = fila.querySelector('.monto-texto');
    const montoInput = fila.querySelector('.editar-monto');

    // Configurar validación en tiempo real
    montoInput.addEventListener('input', (e) => {
      const valor = e.target.value;
      const esValido = validarMonto(valor);

      e.target.classList.toggle('input-error', !esValido);
      const mensajeError = fila.querySelector('.mensaje-error');

      if (!esValido) {
        if (!mensajeError) {
          const error = document.createElement('div');
          error.className = 'mensaje-error visible';
          error.textContent = 'El monto debe ser mayor que 0';
          montoInput.parentNode.appendChild(error);
        }
      } else if (mensajeError) {
        mensajeError.remove();
      }
    });

    // Mostrar input y ocultar texto
    montoCell.style.display = 'none';
    montoInput.style.display = 'block';
    montoInput.focus();

    // Manejar guardado
    montoInput.addEventListener('blur', async () => {
      if (validarMonto(montoInput.value)) {
        await this.editarTransaccion(indice, 'monto', montoInput.value);
      }
      montoCell.style.display = 'block';
      montoInput.style.display = 'none';
    });
  }

  // Métodos similares para descripción y fecha...
}

