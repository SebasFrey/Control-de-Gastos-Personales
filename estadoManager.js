<<<<<<< HEAD
import { formatearNumero, mostrarMensaje } from './utils.js';

export const AppState = {
    transacciones: [],
    categorias: ['sin clasificar', 'otro'],
    saldo: 0,

    ingresos: 0,
    gastos: 0,
    resumenCategoria: {},
    transaccionesPorFecha: {}
};

export class EstadoManager {
    static async inicializar() {
        try {
            const transaccionesGuardadas = localStorage.getItem('transacciones');
            const categoriasGuardadas = localStorage.getItem('categorias');

            if (transaccionesGuardadas) {
                AppState.transacciones = JSON.parse(transaccionesGuardadas);
            }
            if (categoriasGuardadas) {
                const categorias = JSON.parse(categoriasGuardadas);
                // Asegurar que solo existan las categorías predeterminadas al inicio
                AppState.categorias = ['sin clasificar', 'otro'];
                // Agregar cualquier categoría personalizada existente
                categorias.forEach(cat => {
                    if (!AppState.categorias.includes(cat.toLowerCase())) {
                        AppState.categorias.push(cat.toLowerCase());
                    }
                });
            }

            await this.recalcularTotales();
            this.actualizarUI();
        } catch (error) {
            mostrarMensaje('Error al cargar los datos guardados', 'error');
            console.error('Error en inicialización:', error);
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
            } else {
                AppState.gastos += monto;
            }
            this.actualizarSaldoCategoria(transaccion.categoria, monto, transaccion.tipo);
        });

        AppState.saldo = AppState.ingresos - AppState.gastos;
    }

    static actualizarSaldoCategoria(categoria, monto, tipo) {
        if (!AppState.resumenCategoria[categoria]) {
            AppState.resumenCategoria[categoria] = 0;
        }
        if (tipo === 'ingreso') {
            AppState.resumenCategoria[categoria] += monto;
        } else {
            AppState.resumenCategoria[categoria] -= monto;
        }
    }

    static async guardarCambios() {
        try {
            localStorage.setItem('transacciones', JSON.stringify(AppState.transacciones));
            localStorage.setItem('categorias', JSON.stringify(AppState.categorias));
            this.actualizarUI();
        } catch (error) {
            mostrarMensaje('Error al guardar los cambios', 'error');
            console.error('Error al guardar:', error);
        }
    }

    static actualizarUI() {
        actualizarSaldo();
        actualizarResumenCategoria();
        actualizarListaTransacciones();
        actualizarSelectCategorias();
    }
}

=======
import { formatearNumero, mostrarMensaje } from './utils.js';

export const AppState = {
    transacciones: [],
    categorias: ['sin clasificar', 'otro'],
    saldo: 0,

    ingresos: 0,
    gastos: 0,
    resumenCategoria: {},
    transaccionesPorFecha: {}
};

export class EstadoManager {
    static async inicializar() {
        try {
            const transaccionesGuardadas = localStorage.getItem('transacciones');
            const categoriasGuardadas = localStorage.getItem('categorias');

            if (transaccionesGuardadas) {
                AppState.transacciones = JSON.parse(transaccionesGuardadas);
            }
            if (categoriasGuardadas) {
                const categorias = JSON.parse(categoriasGuardadas);
                // Asegurar que solo existan las categorías predeterminadas al inicio
                AppState.categorias = ['sin clasificar', 'otro'];
                // Agregar cualquier categoría personalizada existente
                categorias.forEach(cat => {
                    if (!AppState.categorias.includes(cat.toLowerCase())) {
                        AppState.categorias.push(cat.toLowerCase());
                    }
                });
            }

            await this.recalcularTotales();
            this.actualizarUI();
        } catch (error) {
            mostrarMensaje('Error al cargar los datos guardados', 'error');
            console.error('Error en inicialización:', error);
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
            } else {
                AppState.gastos += monto;
            }
            this.actualizarSaldoCategoria(transaccion.categoria, monto, transaccion.tipo);
        });

        AppState.saldo = AppState.ingresos - AppState.gastos;
    }

    static actualizarSaldoCategoria(categoria, monto, tipo) {
        if (!AppState.resumenCategoria[categoria]) {
            AppState.resumenCategoria[categoria] = 0;
        }
        if (tipo === 'ingreso') {
            AppState.resumenCategoria[categoria] += monto;
        } else {
            AppState.resumenCategoria[categoria] -= monto;
        }
    }

    static async guardarCambios() {
        try {
            localStorage.setItem('transacciones', JSON.stringify(AppState.transacciones));
            localStorage.setItem('categorias', JSON.stringify(AppState.categorias));
            this.actualizarUI();
        } catch (error) {
            mostrarMensaje('Error al guardar los cambios', 'error');
            console.error('Error al guardar:', error);
        }
    }

    static actualizarUI() {
        actualizarSaldo();
        actualizarResumenCategoria();
        actualizarListaTransacciones();
        actualizarSelectCategorias();
    }
}

>>>>>>> aad49fb6d2cf4fdc08aff9182483d419e27ad6e7
