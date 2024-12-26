// Función para formatear números a formato de moneda
function formatearNumero(numero) {
    return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(numero.toFixed(2));
}

// Función para formatear fecha y hora
function formatearFechaHora(fecha) {
    const fechaObj = new Date(fecha);
    const opciones = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return fechaObj.toLocaleString('es-ES', opciones);
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
const entradaOtraCategoria = document.getElementById('otra-categoria');
const contenedorOtraCategoria = document.getElementById('contenedor-otra-categoria');
const botonExportarExcel = document.getElementById('exportar-excel');
const botonExportarPDF = document.getElementById('exportar-pdf');
const botonAgregarCategoria = document.getElementById('agregar-categoria');
const botonExportarJSON = document.getElementById('exportar-json');
const botonImportarJSON = document.getElementById('importar-json');
const botonTransferencia = document.getElementById('transferir-categoria');

// Estado de la aplicación
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
let categorias = JSON.parse(localStorage.getItem('categorias')) || ['sin clasificar', 'salario', 'alimentación', 'transporte', 'entretenimiento', 'otro'];
let saldo = 0;
let ingresos = 0;
let gastos = 0;
let resumenCategoria = {};
let transaccionesPorFecha = {};

// Función para mostrar el indicador de carga
function mostrarCargando() {
    const cargando = document.createElement('div');
    cargando.className = 'cargando';
    cargando.innerHTML = `
        <div class="cargando-contenido">
            <div class="cargando-spinner"></div>
            <p>Procesando datos...</p>
        </div>
    `;
    document.body.appendChild(cargando);
}

// Función para ocultar el indicador de carga
function ocultarCargando() {
    const cargando = document.querySelector('.cargando');
    if (cargando) {
        cargando.remove();
    }
}

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

// Nueva función para realizar transferencias entre categorías
function transferirEntreCategorias(categoriaOrigen, categoriaDestino, monto) {
    if (!resumenCategoria[categoriaOrigen] || resumenCategoria[categoriaOrigen] < monto) {
        alert('Saldo insuficiente en la categoría de origen.');
        return false;
    }

    const fechaActual = new Date().toISOString();

    // Crear transacción de salida
    const transaccionSalida = {
        descripcion: `Transferencia a ${capitalizarPalabras(categoriaDestino)}`,
        monto: monto,
        tipo: 'gasto',
        categoria: categoriaOrigen,
        fecha: fechaActual
    };

    // Crear transacción de entrada
    const transaccionEntrada = {
        descripcion: `Transferencia desde ${capitalizarPalabras(categoriaOrigen)}`,
        monto: monto,
        tipo: 'ingreso',
        categoria: categoriaDestino,
        fecha: fechaActual
    };

    // Agregar las transacciones
    transacciones.push(transaccionSalida, transaccionEntrada);

    // Actualizar saldos de categorías
    actualizarSaldoCategoria(categoriaOrigen, monto, 'gasto');
    actualizarSaldoCategoria(categoriaDestino, monto, 'ingreso');

    // Actualizar UI y guardar cambios
    actualizarListaTransacciones();
    actualizarResumenCategoria();
    guardarTransacciones();

    return true;
}

// Función para eliminar una categoría
function eliminarCategoria(categoria) {
    // No permitir eliminar la categoría "sin clasificar"
    if (categoria.toLowerCase() === 'sin clasificar') {
        alert('No se puede eliminar la categoría "Sin clasificar"');
        return;
    }

    // Verificar si la categoría existe
    const index = categorias.findIndex(cat => cat.toLowerCase() === categoria.toLowerCase());
    if (index === -1) {
        alert('Categoría no encontrada');
        return;
    }

    // Asegurarse de que existe la categoría "sin clasificar"
    if (!categorias.includes('sin clasificar')) {
        categorias.push('sin clasificar');
    }

    // Mover todas las transacciones de la categoría eliminada a "sin clasificar"
    transacciones = transacciones.map(trans => {
        if (trans.categoria.toLowerCase() === categoria.toLowerCase()) {
            return { ...trans, categoria: 'sin clasificar' };
        }
        return trans;
    });

    // Eliminar la categoría
    categorias.splice(index, 1);

    // Actualizar UI y guardar cambios
    actualizarSelectCategorias();
    actualizarResumenCategoria();
    actualizarListaTransacciones();
    guardarTransacciones();
    guardarCategorias();
}

// Función para mostrar el modal de transferencia
function mostrarModalTransferencia() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-contenido">
            <h3>Transferir entre Categorías</h3>
            <form id="formulario-transferencia">
                <div class="grupo-formulario">
                    <label for="categoria-origen">Categoría Origen:</label>
                    <select id="categoria-origen" required>
                        ${categorias.map(cat => `<option value="${cat.toLowerCase()}">${capitalizarPalabras(cat)}</option>`).join('')}
                    </select>
                </div>
                <div class="grupo-formulario">
                    <label for="categoria-destino">Categoría Destino:</label>
                    <select id="categoria-destino" required>
                        ${categorias.map(cat => `<option value="${cat.toLowerCase()}">${capitalizarPalabras(cat)}</option>`).join('')}
                    </select>
                </div>
                <div class="grupo-formulario">
                    <label for="monto-transferencia">Monto:</label>
                    <input type="number" id="monto-transferencia" step="0.01" min="0.01" required>
                </div>
                <div class="botones-modal">
                    <button type="submit" class="boton-primario">Transferir</button>
                    <button type="button" class="boton-secundario" onclick="cerrarModal()">Cancelar</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    // Event listener para el formulario de transferencia
    document.getElementById('formulario-transferencia').addEventListener('submit', function(e) {
        e.preventDefault();
        const categoriaOrigen = document.getElementById('categoria-origen').value;
        const categoriaDestino = document.getElementById('categoria-destino').value;
        const monto = parseFloat(document.getElementById('monto-transferencia').value);

        if (categoriaOrigen === categoriaDestino) {
            alert('Las categorías de origen y destino deben ser diferentes.');
            return;
        }

        if (isNaN(monto) || monto <= 0) {
            alert('Por favor, ingrese un monto válido mayor que 0.');
            return;
        }

        if (transferirEntreCategorias(categoriaOrigen, categoriaDestino, monto)) {
            cerrarModal();
            alert('Transferencia realizada con éxito.');
        }
    });
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Funciones auxiliares
function actualizarSaldo() {
    saldo = ingresos - gastos;
    elementoSaldo.textContent = formatearNumero(saldo);
    elementoIngresos.textContent = formatearNumero(ingresos);
    elementoGastos.textContent = formatearNumero(gastos);
}

// Modificar la función actualizarResumenCategoria para evitar la duplicación del símbolo $
function actualizarResumenCategoria() {
    listaCategoria.innerHTML = '';
    for (const [categoria, monto] of Object.entries(resumenCategoria)) {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="categoria-item">
                <span>${capitalizarPalabras(categoria)}</span>
                <div class="categoria-acciones">
                    <span class="${monto >= 0 ? 'ingreso' : 'gasto'}">${formatearNumero(Math.abs(monto))}</span>
                    ${categoria.toLowerCase() !== 'sin clasificar' ?
                        `<button class="boton-eliminar-categoria" onclick="eliminarCategoria('${categoria}')">
                            <i data-feather="trash-2"></i>
                        </button>` :
                        ''}
                </div>
            </div>`;
        listaCategoria.appendChild(li);
    }
    feather.replace();
}

function actualizarListaTransacciones() {
    listaTransacciones.innerHTML = '';
    const transaccionesFiltradas = filtrarTransacciones();

    // Limpiar y repoblar transaccionesPorFecha
    transaccionesPorFecha = {};
    transaccionesFiltradas.forEach(transaccion => {
        const fecha = new Date(transaccion.fecha).toLocaleDateString();
        if (!transaccionesPorFecha[fecha]) {
            transaccionesPorFecha[fecha] = [];
        }
        transaccionesPorFecha[fecha].push(transaccion);
    });

    // Ordenar fechas de más reciente a más antigua
    const fechasOrdenadas = Object.keys(transaccionesPorFecha).sort((a, b) => {
        return new Date(b) - new Date(a);
    });

    // Crear secciones colapsables por fecha
    fechasOrdenadas.forEach(fecha => {
        const seccionFecha = document.createElement('div');
        seccionFecha.className = 'seccion-fecha';

        const fechaHoy = new Date().toLocaleDateString();
        const esHoy = fecha === fechaHoy;

        // Crear encabezado de la fecha
        const encabezadoFecha = document.createElement('div');
        encabezadoFecha.className = 'encabezado-fecha';
        encabezadoFecha.innerHTML = `
            <div class="fecha-collapse">
                <i data-feather="${esHoy ? 'chevron-down' : 'chevron-right'}" class="icono-colapsar"></i>
                <span>${esHoy ? 'Hoy' : fecha}</span>
            </div>
            <span class="resumen-fecha">
                ${transaccionesPorFecha[fecha].length} transacción(es)
            </span>
        `;

        // Crear contenedor de transacciones
        const contenidoFecha = document.createElement('div');
        contenidoFecha.className = 'contenido-fecha';
        if (!esHoy) {
            contenidoFecha.style.display = 'none';
        }

        // Crear tabla para las transacciones del día
        const tabla = document.createElement('table');
        tabla.className = 'tabla-transacciones-dia';
        tabla.innerHTML = `
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Tipo</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        // Agregar transacciones a la tabla
        transaccionesPorFecha[fecha].forEach((transaccion, indiceLocal) => {
            const indiceGlobal = transacciones.indexOf(transaccion);
            const tr = document.createElement('tr');
            tr.className = `item-transaccion ${transaccion.tipo}`;
            tr.innerHTML = `
                <td>
                    <span class="descripcion-texto">${capitalizarPalabras(transaccion.descripcion || 'Sin descripción')}</span>
                    <input type="text" class="editar-descripcion" style="display: none;" value="${transaccion.descripcion || ''}">
                </td>
                <td>
                    <span class="monto-texto">$${formatearNumero(transaccion.monto)}</span>
                    <input type="number" step="0.01" min="0.01" class="editar-monto" style="display: none;" value="${transaccion.monto}">
                </td>
                <td>${capitalizarPrimeraLetra(transaccion.tipo)}</td>
                <td>${capitalizarPalabras(transaccion.categoria)}</td>
                <td>
                    <div class="acciones-transaccion">
                        <button class="boton-editar-descripcion" onclick="editarDescripcion(${indiceGlobal})">
                            <i data-feather="edit-2"></i>
                        </button>
                        <button class="boton-editar-monto" onclick="editarMonto(${indiceGlobal})">
                            <i data-feather="dollar-sign"></i>
                        </button>
                        <button class="boton-editar-fecha" onclick="editarFecha(${indiceGlobal})">
                            <i data-feather="calendar"></i>
                        </button>
                        <button class="boton-eliminar" onclick="eliminarTransaccion(${indiceGlobal})">
                            <i data-feather="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;
            tabla.querySelector('tbody').appendChild(tr);
        });

        contenidoFecha.appendChild(tabla);
        seccionFecha.appendChild(encabezadoFecha);
        seccionFecha.appendChild(contenidoFecha);
        listaTransacciones.appendChild(seccionFecha);

        // Event listener para colapsar/expandir
        encabezadoFecha.addEventListener('click', () => {
            const icono = encabezadoFecha.querySelector('.icono-colapsar');
            const estaVisible = contenidoFecha.style.display !== 'none';
            contenidoFecha.style.display = estaVisible ? 'none' : 'block';
            icono.setAttribute('data-feather', estaVisible ? 'chevron-right' : 'chevron-down');
            feather.replace();
        });
    });

    feather.replace();
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
    return transacciones;
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
        mostrarCargando();
        const lector = new FileReader();
        lector.onload = function(e) {
            try {
                const datos = JSON.parse(e.target.result);

                // Validar la estructura de los datos
                if (!datos.transacciones || !Array.isArray(datos.transacciones) ||
                    !datos.categorias || !Array.isArray(datos.categorias)) {
                    throw new Error('Formato de archivo inválido');
                }

                // Asegurarse de que existe la categoría "sin clasificar"
                if (!datos.categorias.includes('sin clasificar')) {
                    datos.categorias.push('sin clasificar');
                }

                // Reinicializar variables globales
                transacciones = datos.transacciones;
                categorias = datos.categorias;
                ingresos = 0;
                gastos = 0;
                resumenCategoria = {};

                // Recalcular totales
                transacciones.forEach(transaccion => {
                    if (transaccion.tipo === 'ingreso') {
                        ingresos += parseFloat(transaccion.monto);
                    } else {
                        gastos += parseFloat(transaccion.monto);
                    }
                    actualizarSaldoCategoria(transaccion.categoria, parseFloat(transaccion.monto), transaccion.tipo);
                });

                // Actualizar la interfaz
                actualizarSaldo();
                actualizarResumenCategoria();
                actualizarListaTransacciones();
                actualizarSelectCategorias();

                // Guardar en localStorage
                guardarTransacciones();
                guardarCategorias();

                ocultarCargando();
                alert('Datos importados con éxito');
            } catch (error) {
                console.error('Error al importar datos:', error);
                ocultarCargando();
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
botonTransferencia.addEventListener('click', mostrarModalTransferencia);

function actualizarSelectCategorias() {
    entradaCategoria.innerHTML = '';
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.toLowerCase();
        option.textContent = capitalizarPalabras(categoria);
        entradaCategoria.appendChild(option.cloneNode(true));
    });
}

// Inicialización
function inicializar() {
    resumenCategoria = {};
    ingresos = 0;
    gastos = 0;

    transacciones.forEach(transaccion => {
        if (transaccion.tipo === 'ingreso') {
            ingresos += parseFloat(transaccion.monto);
        } else {
            gastos += parseFloat(transaccion.monto);
        }
        actualizarSaldoCategoria(transaccion.categoria, parseFloat(transaccion.monto), transaccion.tipo);
    });

    actualizarSaldo();
    actualizarResumenCategoria();
    actualizarListaTransacciones();
    actualizarSelectCategorias();
}

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
    const transaccion = transacciones[indice];
    const fecha = new Date(transaccion.fecha).toLocaleDateString();
    const seccionFecha = Array.from(document.querySelectorAll('.seccion-fecha')).find(
        seccion => seccion.querySelector('.fecha-collapse span').textContent === (fecha === new Date().toLocaleDateString() ? 'Hoy' : fecha)
    );

    if (!seccionFecha) return;

    const filas = seccionFecha.querySelectorAll('.item-transaccion');
    const filaIndex = Array.from(filas).findIndex(fila => {
        const montoTexto = fila.querySelector('.monto-texto').textContent.replace('$', '').trim();
        const categoriaTexto = fila.querySelector('td:nth-child(4)').textContent;
        const fechaTexto = new Date(transaccion.fecha).toLocaleDateString();
        return montoTexto === formatearNumero(transaccion.monto) &&
               categoriaTexto === capitalizarPalabras(transaccion.categoria) &&
               fechaTexto === fecha;
    });

    if (filaIndex === -1) return;

    const fila = filas[filaIndex];
    const descripcionTexto = fila.querySelector('.descripcion-texto');
    const descripcionInput = fila.querySelector('.editar-descripcion');
    const botonEditar = fila.querySelector('.boton-editar-descripcion');

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

function editarMonto(indice) {
    const transaccion = transacciones[indice];
    const fecha = new Date(transaccion.fecha).toLocaleDateString();
    const seccionFecha = Array.from(document.querySelectorAll('.seccion-fecha')).find(
        seccion => seccion.querySelector('.fecha-collapse span').textContent === (fecha === new Date().toLocaleDateString() ? 'Hoy' : fecha)
    );

    if (!seccionFecha) return;

    const filas = seccionFecha.querySelectorAll('.item-transaccion');
    const filaIndex = Array.from(filas).findIndex(fila => {
        const montoTexto = fila.querySelector('.monto-texto').textContent.replace('$', '').trim();
        const categoriaTexto = fila.querySelector('td:nth-child(4)').textContent;
        const fechaTexto = new Date(transaccion.fecha).toLocaleDateString();
        return montoTexto === formatearNumero(transaccion.monto) &&
               categoriaTexto === capitalizarPalabras(transaccion.categoria) &&
               fechaTexto === fecha;
    });

    if (filaIndex === -1) return;

    const fila = filas[filaIndex];
    const montoTexto = fila.querySelector('.monto-texto');
    const montoInput = fila.querySelector('.editar-monto');
    const botonEditar = fila.querySelector('.boton-editar-monto');

    if (montoInput.style.display === 'none') {
        montoTexto.style.display = 'none';
        montoInput.style.display = 'inline-block';
        montoInput.focus();
        botonEditar.innerHTML = '<i data-feather="check"></i>';
    } else {
        const nuevoMonto = parseFloat(montoInput.value);
        if (isNaN(nuevoMonto) || nuevoMonto <= 0) {
            alert('Por favor, ingrese un monto válido mayor que 0.');
            return;
        }

        const montoAnterior = transaccion.monto;

        // Actualizar saldos globales
        if (transaccion.tipo === 'ingreso') {
            ingresos = ingresos - montoAnterior + nuevoMonto;
        } else {
            gastos = gastos - montoAnterior + nuevoMonto;
        }

        // Actualizar saldo de categoría
        actualizarSaldoCategoria(transaccion.categoria, montoAnterior, transaccion.tipo === 'ingreso' ? 'gasto' : 'ingreso');
        actualizarSaldoCategoria(transaccion.categoria, nuevoMonto, transaccion.tipo);

        // Actualizar transacción
        transaccion.monto = nuevoMonto;
        montoTexto.textContent = `$${formatearNumero(nuevoMonto)}`;
        montoTexto.style.display = 'inline-block';
        montoInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="dollar-sign"></i>';

        // Actualizar UI y guardar cambios
        actualizarSaldo();
        actualizarResumenCategoria();
        guardarTransacciones();
    }
    feather.replace();
}

function editarFecha(indice) {
    const transaccion = transacciones[indice];
    const fecha = new Date(transaccion.fecha).toLocaleDateString();
    const seccionFecha = Array.from(document.querySelectorAll('.seccion-fecha')).find(
        seccion => seccion.querySelector('.fecha-collapse span').textContent === (fecha === new Date().toLocaleDateString() ? 'Hoy' : fecha)
    );

    if (!seccionFecha) return;

    const filas = seccionFecha.querySelectorAll('.item-transaccion');
    const filaIndex = Array.from(filas).findIndex(fila => {
        const montoTexto = fila.querySelector('.monto-texto').textContent.replace('$', '').trim();
        const categoriaTexto = fila.querySelector('td:nth-child(4)').textContent;
        const fechaTexto = new Date(transaccion.fecha).toLocaleDateString();
        return montoTexto === formatearNumero(transaccion.monto) &&
               categoriaTexto === capitalizarPalabras(transaccion.categoria) &&
               fechaTexto === fecha;
    });

    if (filaIndex === -1) return;

    const fila = filas[filaIndex];
    const fechaTexto = fila.querySelector('.fecha-texto');
    const fechaInput = fila.querySelector('.editar-fecha');
    const botonEditar = fila.querySelector('.boton-editar-fecha');

    if (fechaInput.style.display === 'none') {
        fechaTexto.style.display = 'none';
        fechaInput.style.display = 'inline-block';
        fechaInput.type = 'datetime-local';
        fechaInput.value = transaccion.fecha.slice(0, 16); // Formato YYYY-MM-DDTHH:mm
        fechaInput.focus();
        botonEditar.innerHTML = '<i data-feather="check"></i>';
    } else {
        const nuevaFecha = fechaInput.value;
        if (!nuevaFecha) {
            alert('Por favor, seleccione una fecha y hora válida.');
            return;
        }

        transacciones[indice].fecha = new Date(nuevaFecha).toISOString();
        fechaTexto.textContent = formatearFechaHora(transacciones[indice].fecha);
        fechaTexto.style.display = 'inline-block';
        fechaInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="calendar"></i>';
        actualizarListaTransacciones();
        guardarTransacciones();
    }
    feather.replace();
}

// Inicializar la aplicación
inicializar();

