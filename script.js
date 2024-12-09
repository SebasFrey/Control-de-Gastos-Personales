function formatearNumero(numero) {
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numero);
}

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
const graficoGastos = document.getElementById('grafico-gastos'); //This element is not used anymore

// Estado de la aplicación
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
let saldo = 0;
let ingresos = 0;
let gastos = 0;
let resumenCategoria = {};

// Funciones auxiliares
function actualizarSaldo() {
    saldo = ingresos - gastos;
    elementoSaldo.textContent = formatearNumero(saldo);
    elementoIngresos.textContent = formatearNumero(ingresos);
    elementoGastos.textContent = formatearNumero(gastos);
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
        li.innerHTML = `<span>${categoria}</span><span class="${monto >= 0 ? 'ingreso' : 'gasto'}">$${formatearNumero(Math.abs(monto))}</span>`;
        listaCategoria.appendChild(li);
    }
}

function actualizarGraficoIngresoGasto() {
    const ctx = document.getElementById('grafico-ingresos-gastos').getContext('2d');

    if (window.miGrafico) {
        window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Ingresos', 'Gastos'],
            datasets: [{
                data: [ingresos, gastos],
                backgroundColor: ['#4caf50', '#f44336'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += formatearNumero(context.parsed) + ' (' +
                                    formatearNumero((context.parsed / (ingresos + gastos)) * 100) + '%)';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}


function agregarTransaccionAlDOM(transaccion) {
    const li = document.createElement('li');
    li.className = `item-transaccion ${transaccion.tipo}`;
    li.innerHTML = `
        <span>${transaccion.descripcion}</span>
        <span>$${formatearNumero(transaccion.monto)}</span>
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
    actualizarGraficoIngresoGasto();
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
    actualizarGraficoIngresoGasto();
    actualizarListaTransacciones();
}

inicializar();

