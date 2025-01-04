// Global state management
export const AppState = {
  transacciones: [],
  categorias: ['sin clasificar', 'otro'],
  saldo: 0,
  ingresos: 0,
  gastos: 0,
  resumenCategoria: {},
  transaccionesPorFecha: {}
};

// State management class
export class EstadoManager {
  static async inicializar() {
    try {
      await this.cargarDatos();
      await this.recalcularTotales();
      return true;
    } catch (error) {
      console.error('Error en inicialización:', error);
      return false;
    }
  }

  static async cargarDatos() {
    const transaccionesGuardadas = localStorage.getItem('transacciones');
    const categoriasGuardadas = localStorage.getItem('categorias');

    if (transaccionesGuardadas) {
      AppState.transacciones = JSON.parse(transaccionesGuardadas);
    }
    if (categoriasGuardadas) {
      const categorias = JSON.parse(categoriasGuardadas);
      AppState.categorias = ['sin clasificar', 'otro'];
      categorias.forEach(cat => {
        if (!AppState.categorias.includes(cat.toLowerCase())) {
          AppState.categorias.push(cat.toLowerCase());
        }
      });
    }
  }

  static async guardarCambios() {
    try {
      localStorage.setItem('transacciones', JSON.stringify(AppState.transacciones));
      localStorage.setItem('categorias', JSON.stringify(AppState.categorias));
      return true;
    } catch (error) {
      console.error('Error al guardar:', error);
      return false;
    }
  }

  static async recalcularTotales() {
    AppState.ingresos = 0;
    AppState.gastos = 0;
    AppState.resumenCategoria = {};

    AppState.transacciones.forEach(transaccion => {
      const monto = parseFloat(transaccion.monto);

      if (transaccion.tipo === 'ingreso') {
        AppState.ingresos += monto;
      } else if (transaccion.tipo === 'gasto') {
        AppState.gastos += monto;
      }

      // Optimized category balance calculation
      if (transaccion.tipo === 'transferencia') {
        const esOrigen = transaccion.descripcion.startsWith('Transferencia hacia');
        this.actualizarSaldoCategoria(
          transaccion.categoria,
          monto,
          esOrigen ? 'gasto' : 'ingreso'
        );
      } else {
        this.actualizarSaldoCategoria(
          transaccion.categoria,
          monto,
          transaccion.tipo
        );
      }
    });

    AppState.saldo = AppState.ingresos - AppState.gastos;
  }

  static actualizarSaldoCategoria(categoria, monto, tipo) {
    if (!AppState.resumenCategoria[categoria]) {
      AppState.resumenCategoria[categoria] = 0;
    }
    AppState.resumenCategoria[categoria] += tipo === 'ingreso' ? monto : -monto;
  }

  static validarTransferencia(categoriaOrigen, categoriaDestino, monto) {
    if (categoriaOrigen === categoriaDestino) {
      throw new Error('Las categorías de origen y destino deben ser diferentes');
    }

    const saldoOrigen = AppState.resumenCategoria[categoriaOrigen] || 0;
    if (saldoOrigen < monto) {
      throw new Error('Saldo insuficiente en la categoría origen');
    }

    const tieneTransacciones = AppState.transacciones.some(
      trans => trans.categoria === categoriaOrigen
    );
    if (!tieneTransacciones) {
      throw new Error('La categoría origen no tiene transacciones');
    }

    return true;
  }
}

