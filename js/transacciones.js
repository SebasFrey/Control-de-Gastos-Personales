import { AppState, EstadoManager } from './estado.js';
import { UIManager } from './ui.js';
import { formatearFechaHora, capitalizarPalabras, validarMontoEnTiempoReal } from './utilidades.js';

export class TransactionManager {
  static async agregarTransaccion(formData) {
    try {
      UIManager.toggleCargando(true);

      let categoria = formData.get('categoria');
      if (categoria === 'otro') {
        categoria = formData.get('otra-categoria').trim().toLowerCase();
        if (!AppState.categorias.includes(categoria)) {
          AppState.categorias.push(categoria);
        }
      }

      const monto = parseFloat(formData.get('monto'));
      if (isNaN(monto) || monto <= 0) {
        throw new Error('Monto inválido');
      }

      const nuevaTransaccion = {
        descripcion: formData.get('descripcion') || null,
        monto,
        tipo: formData.get('tipo'),
        categoria,
        fecha: new Date().toISOString()
      };

      AppState.transacciones.push(nuevaTransaccion);
      await EstadoManager.recalcularTotales();
      await EstadoManager.guardarCambios();

      UIManager.mostrarMensaje('Transacción agregada con éxito', 'success');
      return true;
    } catch (error) {
      UIManager.mostrarMensaje(error.message, 'error');
      return false;
    } finally {
      UIManager.toggleCargando(false);
    }
  }

  static async realizarTransferencia(formData) {
    try {
      UIManager.toggleCargando(true);

      const monto = parseFloat(formData.get('monto-transferencia'));
      const categoriaOrigen = formData.get('categoria-origen');
      const categoriaDestino = formData.get('categoria-destino');

      // Validate transfer
      validarTransferencia(categoriaOrigen, categoriaDestino, monto);

      // Create transfer transactions
      const transaccionOrigen = {
        descripcion: `Transferencia hacia ${capitalizarPalabras(categoriaDestino)}`,
        monto,
        tipo: 'transferencia',
        categoria: categoriaOrigen,
        fecha: new Date().toISOString()
      };

      const transaccionDestino = {
        descripcion: `Transferencia desde ${capitalizarPalabras(categoriaOrigen)}`,
        monto,
        tipo: 'transferencia',
        categoria: categoriaDestino,
        fecha: new Date().toISOString()
      };

      AppState.transacciones.push(transaccionOrigen, transaccionDestino);
      await EstadoManager.recalcularTotales();
      await EstadoManager.guardarCambios();

      UIManager.mostrarMensaje('Transferencia realizada con éxito', 'success');
      return true;
    } catch (error) {
      UIManager.mostrarMensaje(error.message, 'error');
      return false;
    } finally {
      UIManager.toggleCargando(false);
    }
  }

  static async editarTransaccion(indice, campo, valor) {
    try {
      UIManager.toggleCargando(true);

      // Validar según el tipo de campo
      switch (campo) {
        case 'monto':
          if (!validarMontoEnTiempoReal(valor)) {
            throw new Error('Monto inválido');
          }
          break;
        case 'fecha':
          if (!validarFecha(valor)) {
            throw new Error('Fecha inválida');
          }
          break;
      }

      const transaccion = AppState.transacciones[indice];
      if (!transaccion) {
        throw new Error('Transacción no encontrada');
      }

      transaccion[campo] = valor;

      await EstadoManager.recalcularTotales();
      await EstadoManager.guardarCambios();

      UIManager.mostrarMensaje('Transacción actualizada con éxito', 'success');
      return true;
    } catch (error) {
      UIManager.mostrarMensaje(error.message, 'error');
      return false;
    } finally {
      UIManager.toggleCargando(false);
    }
  }

  static async eliminarTransaccion(indice) {
    try {
      UIManager.toggleCargando(true);

      AppState.transacciones.splice(indice, 1);
      await EstadoManager.recalcularTotales();
      await EstadoManager.guardarCambios();

      UIManager.mostrarMensaje('Transacción eliminada con éxito', 'success');
      return true;
    } catch (error) {
      UIManager.mostrarMensaje('Error al eliminar la transacción', 'error');
      return false;
    } finally {
      UIManager.toggleCargando(false);
    }
  }
}

// Function to validate transfer
const validarTransferencia = (categoriaOrigen, categoriaDestino, monto) => {
  if (categoriaOrigen === categoriaDestino) {
    throw new Error('Las categorías deben ser diferentes');
  }

  const saldoOrigen = AppState.resumenCategoria[categoriaOrigen] || 0;
  if (saldoOrigen < monto) {
    throw new Error('Saldo insuficiente en la categoría origen');
  }

  return true;
};

