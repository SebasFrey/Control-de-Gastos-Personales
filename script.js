// Elementos del DOM
const formulario = document.getElementById('formulario-transaccion');
const entradaDescripcion = document.getElementById('descripcion');
const entradaMonto = document.getElementById('monto');
const entradaTipo = document.getElementById('tipo');
const entradaCategoria = document.getElementById('categoria');
const elementoSaldo = document.getElementById('saldo');
const elementoIngresos = document.getElementById('ingresos');
const elementoGastos = document.getElementById('gastos');
const listaCategoria = document.getElementById('lista-categoria');
const listaTransacciones = document.getElementById('lista-transacciones');
const seleccionFiltro = document.getElementById('filtro');
const graficoGastos = document.getElementById('grafico-gastos');

// Estado de la aplicación
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
let saldo = 0;
let ingresos = 0;
let gastos = 0;
let resumenCategoria = {};

// Funciones auxiliares
function actualizarSaldo() {
    saldo = ingresos - gastos;
    elementoSaldo.textContent = saldo.toFixed(2);
    elementoIngresos.textContent = ingresos.toFixed(2);
    elementoGastos.textContent = gastos.toFixed(2);
}

function actualizarResumenCategoria() {
    resumenCategoria = {};
    transacciones.forEach(transaccion => {
        if (!resumenCategoria[transaccion.categoria]) {
            resumenCategoria[transaccion.categoria] = 0;
        }
        if (transaccion.tipo === 'ingreso') {
            resumenCategoria[transaccion.categoria] += transaccion.monto;
        } else {
            resumenCategoria[transaccion.categoria] -= transaccion.monto;
        }
    });

    listaCategoria.innerHTML = '';
    for (const [categoria, monto] of Object.entries(resumenCategoria)) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${categoria}</span><span>$${Math.abs(monto).toFixed(2)}</span>`;
        li.className = monto >= 0 ? 'ingreso' : 'gasto';
        listaCategoria.appendChild(li);
    }
}

function actualizarGraficoGastos() {
    graficoGastos.innerHTML = '';
    const categoriasGastos = Object.entries(resumenCategoria).filter(([, monto]) => monto < 0);
    const totalGastos = categoriasGastos.reduce((total, [, monto]) => total + Math.abs(monto), 0);

    categoriasGastos.forEach(([categoria, monto]) => {
        const porcentaje = (Math.abs(monto) / totalGastos) * 100;
        const barra = document.createElement('div');
        barra.className = 'barra-grafico';
        barra.style.height= `${porcentaje}%`;
        barra.setAttribute('data-tooltip', `${categoria}: $${Math.abs(monto).toFixed(2)} (${porcentaje.toFixed(2)}%)`);
        graficoGastos.appendChild(barra);
    });
}

function agregarTransaccionAlDOM(transaccion) {
    const li = document.createElement('li');
    li.className = `item-transaccion ${transaccion.tipo}`;
    li.innerHTML = `
        <span>${transaccion.descripcion}</span>
        <span>$${transaccion.monto.toFixed(2)}</span>
        <span>${transaccion.categoria}</span>
    `;
    listaTransacciones.appendChild(li);
}

function actualizarListaTransacciones() {
    listaTransacciones.innerHTML = '';
    const transaccionesFiltradas = transacciones.filter(transaccion => {
        return seleccionFiltro.value === 'todos' || transaccion.tipo === seleccionFiltro.value;
    });
    transaccionesFiltradas.forEach(agregarTransaccionAlDOM);
}

function guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

// Event Listeners
formulario.addEventListener('submit', e => {
    e.preventDefault();

    const descripcion = entradaDescripcion.value;
    const monto = parseFloat(entradaMonto.value);
    const tipo = entradaTipo.value;
    const categoria = entradaCategoria.value;

    if (descripcion.trim() === '' || isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese datos válidos.');
        return;
    }

    const transaccion = { descripcion, monto, tipo, categoria };
    transacciones.push(transaccion);

    if (tipo === 'ingreso') {
        ingresos += monto;
    } else {
        gastos += monto;
    }

    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarGraficoGastos();
    agregarTransaccionAlDOM(transaccion);
    guardarTransacciones();

    // Limpiar el formulario
    formulario.reset();
});

seleccionFiltro.addEventListener('change', actualizarListaTransacciones);

// Inicialización
function inicializar() {
    transacciones.forEach(transaccion => {
        if (transaccion.tipo === 'ingreso') {
            ingresos += transaccion.monto;
        } else {
            gastos += transaccion.monto;
        }
    });

    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarGraficoGastos();
    actualizarListaTransacciones();
}

inicializar();
