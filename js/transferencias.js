import { AppState } from './estado.js';
import { UIManager } from './ui.js';
import { formatearNumero } from './utilidades.js';

export class TransferenciasManager {
  static validarTransferencia(origen, destino, monto) {
    const errores = [];

    // Validar que las categorías sean diferentes
    if (origen === destino) {
      errores.push('Las categorías de origen y destino deben ser diferentes');
    }

    // Validar que exista saldo suficiente
    const saldoOrigen = AppState.resumenCategoria[origen] || 0;
    if (saldoOrigen < monto) {
      errores.push(`Saldo insuficiente en ${origen}. Disponible: $${formatearNumero(saldoOrigen)}`);
    }

    // Validar que la categoría origen tenga transacciones
    const tieneTransacciones = AppState.transacciones.some(
      t => t.categoria === origen
    );
    if (!tieneTransacciones) {
      errores.push(`La categoría ${origen} no tiene transacciones`);
    }

    return {
      esValido: errores.length === 0,
      errores
    };
  }

  static async realizarTransferencia(formData) {
    try {
      const monto = parseFloat(formData.get('monto-transferencia'));
      const origen = formData.get('categoria-origen');
      const destino = formData.get('categoria-destino');

      // Validaciones
      const { esValido, errores } = this.validarTransferencia(origen, destino, monto);
      if (!esValido) {
        throw new Error(errores.join('\n'));
      }

      // Crear transacciones de transferencia
      const fechaActual = new Date().toISOString();
      const transacciones = [
        {
          tipo: 'transferencia',
          categoria: origen,
          monto,
          descripcion: `Transferencia hacia ${destino}`,
          fecha: fechaActual
        },
        {
          tipo: 'transferencia',
          categoria: destino,
          monto,
          descripcion: `Transferencia desde ${origen}`,
          fecha: fechaActual
        }
      ];

      // Actualizar estado
      AppState.transacciones.push(...transacciones);
      await AppState.guardarCambios();

      UIManager.mostrarMensaje('Transferencia realizada con éxito', 'success');
      return true;
    } catch (error) {
      UIManager.mostrarMensaje(error.message, 'error');
      return false;
    }
  }
}

