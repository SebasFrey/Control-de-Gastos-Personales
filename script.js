// Función para formatear números a formato de moneda
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numero.toFixed(2));
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
const seleccionFiltroTipo = document.getElementById('filtro-tipo');
const seleccionFiltroCategoria = document.getElementById('filtro-categoria');
const filtroFechaInicio = document.getElementById('filtro-fecha-inicio');
const filtroFechaFin = document.getElementById('filtro-fecha-fin');
const botonAplicarFiltros = document.getElementById('aplicar-filtros');
const entradaOtraCategoria = document.getElementById('otra-categoria');
const contenedorOtraCategoria = document.getElementById('contenedor-otra-categoria');
const botonExportarExcel = document.getElementById('exportar-excel');
const botonExportarPDF = document.getElementById('exportar-pdf');
const botonModoOscuro = document.getElementById('modo-oscuro');
const botonAgregarCategoria = document.getElementById('agregar-categoria');
const botonExportarJSON = document.getElementById('exportar-json');
const botonImportarJSON = document.getElementById('importar-json');

// Estado de la aplicación
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
let categorias = JSON.parse(localStorage.getItem('categorias')) || ['Salario', 'Alimentación', 'Transporte', 'Entretenimiento', 'Otro'];
let saldo = 0;
let ingresos = 0;
let gastos = 0;
let resumenCategoria = {};

// Nueva función para actualizar el saldo de una categoría
function actualizarSaldoCategoria(categoria, monto, tipo) {
    if (!resumenCategoria[categoria]) {
        resumenCategoria[categoria] = 0;
    }
    if (tipo === 'ingreso') {
        resumenCategoria[categoria] += monto;
    } else {
        resumenCategoria[categoria] -= monto;
    }
}

// Funciones auxiliares
function actualizarSaldo() {
    saldo = ingresos - gastos;
    elementoSaldo.textContent = formatearNumero(saldo);
    elementoIngresos.textContent = formatearNumero(ingresos);
    elementoGastos.textContent = formatearNumero(gastos);
}

function actualizarResumenCategoria() {
    listaCategoria.innerHTML = '';
    for (const [categoria, monto] of Object.entries(resumenCategoria)) {
        const li = document.createElement('li');
        li.innerHTML = `<span>${capitalizarPalabras(categoria)}</span><span class="${monto >= 0 ? 'ingreso' : 'gasto'}">$${formatearNumero(Math.abs(monto))}</span>`;
        listaCategoria.appendChild(li);
    }
}

function agregarTransaccionAlDOM(transaccion, indice) {
    const tr = document.createElement('tr');
    tr.className = `item-transaccion ${transaccion.tipo}`;
    tr.innerHTML = `
        <td>
            <span class="descripcion-texto">${capitalizarPalabras(transaccion.descripcion || 'Sin descripción')}</span>
            <input type="text" class="editar-descripcion" style="display: none;" value="${transaccion.descripcion || ''}">
        </td>
        <td>$${formatearNumero(transaccion.monto)}</td>
        <td>${capitalizarPrimeraLetra(transaccion.tipo)}</td>
        <td>${capitalizarPalabras(transaccion.categoria)}</td>
        <td>${new Date(transaccion.fecha).toLocaleDateString()}</td>
        <td>
            <button class="boton-editar" onclick="editarDescripcion(${indice})">
                <i data-feather="edit-2"></i>
            </button>
            <button class="boton-eliminar" onclick="eliminarTransaccion(${indice})">
                <i data-feather="trash-2"></i>
            </button>
        </td>
    `;
    listaTransacciones.appendChild(tr);
    feather.replace();
}

function actualizarListaTransacciones() {
    listaTransacciones.innerHTML = '';
    const transaccionesFiltradas = filtrarTransacciones();
    transaccionesFiltradas.forEach((transaccion, indice) => {
        agregarTransaccionAlDOM(transaccion, indice);
    });
}

function guardarTransacciones() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
}

function guardarCategorias() {
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

function eliminarTransaccion(indice) {
    const transaccion = transacciones[indice];
    if (transaccion.tipo === 'ingreso') {
        ingresos -= transaccion.monto;
    } else {
        gastos -= transaccion.monto;
    }
    actualizarSaldoCategoria(transaccion.categoria, transaccion.monto, transaccion.tipo === 'ingreso' ? 'gasto' : 'ingreso');
    transacciones.splice(indice, 1);
    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarListaTransacciones();
    guardarTransacciones();
}

function filtrarTransacciones() {
    return transacciones.filter(transaccion => {
        const cumpleFiltroTipo = seleccionFiltroTipo.value === 'todos' || transaccion.tipo === seleccionFiltroTipo.value;
        const cumpleFiltroCategoria = seleccionFiltroCategoria.value === 'todas' || transaccion.categoria === seleccionFiltroCategoria.value;
        const cumpleFiltroFecha = (!filtroFechaInicio.value || new Date(transaccion.fecha) >= new Date(filtroFechaInicio.value)) &&
                                  (!filtroFechaFin.value || new Date(transaccion.fecha) <= new Date(filtroFechaFin.value));
        return cumpleFiltroTipo && cumpleFiltroCategoria && cumpleFiltroFecha;
    });
}

function exportarExcel() {
    const ws = XLSX.utils.json_to_sheet(transacciones.map(t => ({
        Descripción: capitalizarPrimeraLetra(t.descripcion || 'Sin descripción'),
        Monto: t.monto,
        Tipo: capitalizarPrimeraLetra(t.tipo),
        Categoría: capitalizarPrimeraLetra(t.categoria),
        Fecha: new Date(t.fecha).toLocaleDateString()
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transacciones");

    XLSX.writeFile(wb, "Control De Gastos Personales.xlsx");
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Control de Gastos Personales", 14, 15);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);
    doc.text(`Saldo Total: $${formatearNumero(saldo)}`, 14, 35);
    doc.text(`Total Ingresos: $${formatearNumero(ingresos)}`, 14, 45);
    doc.text(`Total Gastos: $${formatearNumero(gastos)}`, 14, 55);

    const columns = ["Descripción", "Monto", "Tipo", "Categoría", "Fecha"];
    const data = transacciones.map(t => [
        capitalizarPrimeraLetra(t.descripcion || 'Sin descripción'),
        `$${formatearNumero(t.monto)}`,
        capitalizarPrimeraLetra(t.tipo),
        capitalizarPrimeraLetra(t.categoria),
        new Date(t.fecha).toLocaleDateString()
    ]);

    doc.autoTable({
        head: [columns],
        body: data,
        startY: 65,
    });

    doc.save("Control De Gastos Personales.pdf");
}

// Función para exportar datos a JSON
function exportarJSON() {
    const datos = {
        transacciones: transacciones,
        categorias: categorias
    };
    const jsonString = JSON.stringify(datos, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'Control De Gastos Personales.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para importar datos desde JSON
function importarJSON(evento) {
    const archivo = evento.target.files[0];
    if (archivo) {
        const lector = new FileReader();
        lector.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);
                transacciones = datos.transacciones;
                categorias = datos.categorias;

                // Reinicializar la aplicación
                ingresos = 0;
                gastos = 0;
                inicializar();
                guardarTransacciones();
                guardarCategorias();

                alert('Datos importados con éxito');
            } catch (error) {
                console.error('Error al importar datos:', error);
                alert('Error al importar datos. Por favor, asegúrese de que el archivo es válido.');
            }
        };
        lector.readAsText(archivo);
    }
}

// Event Listeners
formulario.addEventListener('submit', e => {
    e.preventDefault();

    const descripcion = entradaDescripcion.value.trim();
    const monto = parseFloat(entradaMonto.value);
    const tipo = entradaTipo.value;
    let categoria = entradaCategoria.value;

    if (isNaN(monto) || monto <= 0) {
        alert('Por favor, ingrese un monto válido.');
        return;
    }

    if (categoria === 'otro') {
        const otraCategoria = entradaOtraCategoria.value.trim();
        if (otraCategoria === '') {
            alert('Por favor, especifique un nombre para la categoría "Otro".');
            return;
        }
        categoria = otraCategoria;
        if (!categorias.includes(categoria)) {
            categorias.push(categoria);
            actualizarSelectCategorias();
            guardarCategorias();
        }
    }

    const transaccion = {
        descripcion: descripcion || null,
        monto,
        tipo,
        categoria,
        fecha: new Date().toISOString()
    };
    transacciones.push(transaccion);

    if (tipo === 'ingreso') {
        ingresos += monto;
    } else {
        gastos += monto;
    }

    actualizarSaldoCategoria(categoria, monto, tipo);
    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarListaTransacciones();
    guardarTransacciones();

    formulario.reset();
    contenedorOtraCategoria.style.display = 'none';
});

entradaCategoria.addEventListener('change', (e) => {
    if (e.target.value === 'otro') {
        contenedorOtraCategoria.style.display = 'block';
    } else {
        contenedorOtraCategoria.style.display = 'none';
    }
});

botonExportarExcel.addEventListener('click', exportarExcel);
botonExportarPDF.addEventListener('click', exportarPDF);

botonAplicarFiltros.addEventListener('click', actualizarListaTransacciones);

botonModoOscuro.addEventListener('click', () => {
    document.body.classList.toggle('modo-oscuro');
    botonModoOscuro.textContent = document.body.classList.contains('modo-oscuro') ? '☀️' : '🌙';
});

botonAgregarCategoria.addEventListener('click', () => {
    const nuevaCategoria = prompt('Ingrese el nombre de la nueva categoría:');
    if (nuevaCategoria && !categorias.includes(nuevaCategoria)) {
        categorias.push(nuevaCategoria);
        actualizarSelectCategorias();
        guardarCategorias();
    }
});

botonExportarJSON.addEventListener('click', exportarJSON);
botonImportarJSON.addEventListener('change', importarJSON);

function actualizarSelectCategorias() {
    entradaCategoria.innerHTML = '';
    seleccionFiltroCategoria.innerHTML = '<option value="todas">Todas</option>';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.toLowerCase();
        option.textContent = capitalizarPalabras(categoria);
        entradaCategoria.appendChild(option.cloneNode(true));
        seleccionFiltroCategoria.appendChild(option);
    });
}

// Inicialización
function inicializar() {
    resumenCategoria = {};
    transacciones.forEach(transaccion => {
        if (transaccion.tipo === 'ingreso') {
            ingresos += transaccion.monto;
        } else {
            gastos += transaccion.monto;
        }
        actualizarSaldoCategoria(transaccion.categoria, transaccion.monto, transaccion.tipo);
    });

    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarListaTransacciones();
    actualizarSelectCategorias();
}

inicializar();

// Función para capitalizar solo la primera letra de una palabra
function capitalizarPrimeraLetra(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/^\w/, c => c.toUpperCase());
}

// Función para capitalizar la primera letra de cada palabra
function capitalizarPalabras(str) {
    if (!str) return '';
    return str.toLowerCase().split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function editarDescripcion(indice) {
    const fila = listaTransacciones.children[indice];
    const descripcionTexto = fila.querySelector('.descripcion-texto');
    const descripcionInput = fila.querySelector('.editar-descripcion');
    const botonEditar = fila.querySelector('.boton-editar');

    if (descripcionInput.style.display === 'none') {
        descripcionTexto.style.display = 'none';
        descripcionInput.style.display = 'inline-block';
        descripcionInput.focus();
        botonEditar.innerHTML = '<i data-feather="check"></i>';
    } else {
        const nuevaDescripcion = descripcionInput.value.trim();
        transacciones[indice].descripcion = nuevaDescripcion || null;
        descripcionTexto.textContent = capitalizarPalabras(nuevaDescripcion || 'Sin descripción');
        descripcionTexto.style.display = 'inline-block';
        descripcionInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="edit-2"></i>';
        guardarTransacciones();
    }
    feather.replace();
}

