// Estado global de la aplicación
const AppState = {
    transacciones: [],
    categorias: ['sin clasificar', 'otro'],
    saldo: 0,
    ingresos: 0,
    gastos: 0,
    resumenCategoria: {},
    transaccionesPorFecha: {}
};

// Variables para el manejo del scroll
let lastScrollPosition = 0;
let isScrolling = false;

// Función para manejar el scroll y ocultar/mostrar el header
function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const currentScroll = window.pageYOffset;
            const header = document.querySelector('header');

            if (currentScroll > lastScrollPosition && currentScroll > 50) {
                header.classList.add('hidden');            } else if (currentScroll < lastScrollPosition) {
                header.classList.remove('hidden');
            }

            lastScrollPosition = currentScroll;
            isScrolling = false;
        });
    }
    isScrolling = true;
}

// Clase para manejar el estado y la persistencia
class EstadoManager {
    static async inicializar() {
        // Intentar cargar datos guardados desde localStorage
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
            // Mostrar mensaje de error si ocurre un problema al cargar los datos
            mostrarMensaje('Error al cargar los datos guardados', 'error');
            console.error('Error en inicialización:', error);
        }
    }

    static async recalcularTotales() {
        // Inicializar totales
        AppState.ingresos = 0;
        AppState.gastos = 0;
        AppState.resumenCategoria = {};

        // Recorrer todas las transacciones para calcular ingresos, gastos y actualizar el saldo por categoría
        AppState.transacciones.forEach(transaccion => {
            const monto = parseFloat(transaccion.monto);
            // Solo contar ingresos y gastos, no transferencias
            if (transaccion.tipo === 'ingreso') {
                AppState.ingresos += monto;
            } else if (transaccion.tipo === 'gasto') {
                AppState.gastos += monto;
            }
            // Actualizar saldo de categoría
            if (transaccion.tipo === 'transferencia') {
                // Para transferencias, el efecto en la categoría depende de si es origen o destino
                const esOrigen = transaccion.descripcion.startsWith('Transferencia hacia');
                if (esOrigen) {
                    this.actualizarSaldoCategoria(transaccion.categoria, monto, 'gasto');
                } else {
                    this.actualizarSaldoCategoria(transaccion.categoria, monto, 'ingreso');
                }
            } else {
                this.actualizarSaldoCategoria(transaccion.categoria, monto, transaccion.tipo);
            }
        });

        // Calcular el saldo total
        AppState.saldo = AppState.ingresos - AppState.gastos;
    }

    static actualizarSaldoCategoria(categoria, monto, tipo) {
        // Asegurar que la categoría exista en el resumen
        if (!AppState.resumenCategoria[categoria]) {
            AppState.resumenCategoria[categoria] = 0;
        }
        // Actualizar el saldo de la categoría según el tipo de transacción
        if (tipo === 'ingreso') {
            AppState.resumenCategoria[categoria] += monto;
        } else {
            AppState.resumenCategoria[categoria] -= monto;
        }
    }

    static async guardarCambios() {
        // Intentar guardar los cambios en localStorage
        try {
            localStorage.setItem('transacciones', JSON.stringify(AppState.transacciones));
            localStorage.setItem('categorias', JSON.stringify(AppState.categorias));
            this.actualizarUI();
        } catch (error) {
            // Mostrar mensaje de error si ocurre un problema al guardar los cambios
            mostrarMensaje('Error al guardar los cambios', 'error');
            console.error('Error al guardar:', error);
        }
    }

    static actualizarUI() {
        // Actualizar diferentes partes de la interfaz de usuario
        actualizarSaldo();
        actualizarResumenCategoria();
        actualizarListaTransacciones();
        actualizarSelectCategorias();
    }
}

// Utilidades
const formatearNumero = (numero) => {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numero.toFixed(2));
};

const formatearFechaHora = (fecha) => {
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const capitalizarPrimeraLetra = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

const capitalizarPalabras = (str) => {
    if (!str) return '';
    return str.toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

// Validación de formularios
const validarFormulario = (formData) => {
    const errores = {};

    // Validar monto
    const monto = parseFloat(formData.get('monto'));
    if (!monto || monto <= 0) {
        errores.monto = 'Ingrese un monto válido mayor que 0';
    }

    // Validar tipo
    const tipo = formData.get('tipo');
    if (!['ingreso', 'gasto'].includes(tipo)) {
        errores.tipo = 'Seleccione un tipo válido';
    }

    // Validar categoría
    const categoria = formData.get('categoria');
    if (!categoria) {
        errores.categoria = 'Seleccione una categoría';
    }

    // Validar otra categoría si es necesario
    if (categoria === 'otro') {
        const otraCategoria = formData.get('otra-categoria');
        if (!otraCategoria || otraCategoria.length < 2) {
            errores.otraCategoria = 'Ingrese un nombre válido para la categoría (mínimo 2 caracteres)';
        } else if (AppState.categorias.includes(otraCategoria.toLowerCase())) {
            errores.otraCategoria = 'La categoría ya existe';
        }
    }

    return errores;
};

// Gestión de mensajes
const mostrarMensaje = (mensaje, tipo = 'info') => {
    const contenedor = document.getElementById('mensajes');
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje mensaje-${tipo}`;
    mensajeElement.textContent = mensaje;
    mensajeElement.setAttribute('role', 'alert');
    mensajeElement.setAttribute('aria-live', 'assertive');

    contenedor.appendChild(mensajeElement);

    setTimeout(() => {
        mensajeElement.remove();
    }, 3000);
};

// Función para mostrar mensajes de error en el formulario
const mostrarErroresFormulario = (errores) => {
    Object.entries(errores).forEach(([campo, mensaje]) => {
        const elementoError = document.getElementById(`error-${campo}`);
        if (elementoError) {
            elementoError.textContent = mensaje;
            elementoError.setAttribute('role', 'alert');
            elementoError.setAttribute('aria-live', 'assertive');
        }
    });
};

// Manejadores de eventos
const handleSubmitFormulario = async (e) => {
    e.preventDefault();

    // Validar los datos del formulario
    const formData = new FormData(e.target);
    const errores = validarFormulario(formData);

    // Mostrar errores si existen
    if (Object.keys(errores).length > 0) {
        mostrarErroresFormulario(errores);
        return;
    }

    // Limpiar mensajes de error previos
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.textContent = '';
        el.removeAttribute('role');
        el.removeAttribute('aria-live');
    });

    try {
        // Procesar la nueva transacción
        let categoria = formData.get('categoria');
        if (categoria === 'otro') {
            categoria = formData.get('otra-categoria').trim().toLowerCase();
            if (!AppState.categorias.includes(categoria)) {
                AppState.categorias.push(categoria);
            }
        }

        const monto = parseFloat(formData.get('monto'));
        if (isNaN(monto) || monto <= 0) {
            mostrarMensaje('Ingrese un monto válido mayor que 0', 'error');
            return;
        }

        const nuevaTransaccion = {
            descripcion: formData.get('descripcion') || null,
            monto: monto,
            tipo: formData.get('tipo'),
            categoria,
            fecha: new Date().toISOString()
        };

        AppState.transacciones.push(nuevaTransaccion);
        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();

        e.target.reset();
        document.getElementById('contenedor-otra-categoria').style.display = 'none';
        mostrarMensaje('Transacción agregada con éxito', 'success');
    } catch (error) {
        // Mostrar mensaje de error si ocurre un problema al agregar la transacción
        mostrarMensaje('Error al agregar la transacción', 'error');
        console.error('Error en submit:', error);
    }
};

const handleCategoriaChange = (e) => {
    const contenedorOtraCategoria = document.getElementById('contenedor-otra-categoria');
    contenedorOtraCategoria.style.display = e.target.value === 'otro' ? 'block' : 'none';
};

// Funciones de actualización de UI
const actualizarSaldo = () => {
    // Actualizar los elementos del DOM con los valores de saldo, ingresos y gastos
    document.getElementById('saldo').textContent = formatearNumero(AppState.saldo);
    document.getElementById('ingresos').textContent = formatearNumero(AppState.ingresos);
    document.getElementById('gastos').textContent = formatearNumero(AppState.gastos);
};

const actualizarResumenCategoria = () => {
    // Actualizar la lista de categorías en la interfaz de usuario
    const listaCategoria = document.getElementById('lista-categoria');
    listaCategoria.innerHTML = '';

    // Recorrer el resumen de categorías y crear elementos de lista
    Object.entries(AppState.resumenCategoria).forEach(([categoria, monto]) => {
        const li = document.createElement('li');
        const tipoClase = monto >= 0 ? 'ingreso' : 'gasto';

        li.innerHTML = `
            <div class="categoria-item ${tipoClase}">
                <div class="categoria-info">
                    <span class="categoria-nombre">${capitalizarPalabras(categoria)}</span>
                </div>
                <div class="categoria-acciones">
                    <span class="categoria-monto ${tipoClase}">
                        ${formatearNumero(Math.abs(monto))}
                    </span>
                    ${categoria.toLowerCase() !== 'sin clasificar' && categoria.toLowerCase() !== 'otro' ? `
                        <button
                            class="boton-eliminar-categoria"
                            data-categoria="${categoria}"
                            aria-label="Eliminar categoría ${categoria}"
                        >
                            <i data-feather="trash-2"></i>
                        </button>
                    ` : ''}
                </div>
            </div>`;
        listaCategoria.appendChild(li);
    });

    feather.replace();
};

const actualizarListaTransacciones = () => {
    // Actualizar la lista de transacciones en la interfaz de usuario
    const listaTransacciones = document.getElementById('lista-transacciones');
    listaTransacciones.innerHTML = '';

    // Agrupar transacciones por fecha
    const transaccionesPorFecha = AppState.transacciones.reduce((acc, trans) => {
        const fecha = new Date(trans.fecha).toLocaleDateString();
        if (!acc[fecha]) {
            acc[fecha] = [];
        }
        acc[fecha].push(trans);
        return acc;
    }, {});

    // Crear secciones de transacciones por fecha
    Object.entries(transaccionesPorFecha)
        .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
        .forEach(([fecha, transacciones]) => {
            const seccionFecha = crearSeccionFecha(fecha, transacciones);
            listaTransacciones.appendChild(seccionFecha);
        });

    requestAnimationFrame(() => {
        feather.replace();
    });
};

const crearSeccionFecha = (fecha, transacciones) => {
    const seccion = document.createElement('div');
    seccion.className = 'seccion-fecha';

    const esHoy = fecha === new Date().toLocaleDateString();
    const encabezado = document.createElement('div');
    encabezado.className = 'encabezado-fecha';
    encabezado.setAttribute('aria-expanded', esHoy);
    encabezado.setAttribute('role', 'button');
    encabezado.setAttribute('tabindex', '0');
    encabezado.setAttribute('aria-controls', `contenido-${fecha}`);
    encabezado.innerHTML = `
        <div class="fecha-collapse">
            <i data-feather="${esHoy ? 'chevron-down' : 'chevron-right'}" class="icono-colapsar"></i>
            <span>${esHoy ? 'Hoy' : fecha}</span>
        </div>
        <span class="resumen-fecha">${transacciones.length} transacción(es)</span>
    `;

    const contenido = document.createElement('div');
    contenido.className = 'contenido-fecha';
    contenido.id = `contenido-${fecha}`;
    contenido.style.height = esHoy ? 'auto' : '0';

    const tabla = document.createElement('table');
    tabla.className = 'tabla-transacciones-dia';
    tabla.setAttribute('role', 'table');
    tabla.innerHTML = `
        <thead>
            <tr>
                <th scope="col">Descripción</th>
                <th scope="col">Monto</th>
                <th scope="col">Tipo</th>
                <th scope="col">Categoría</th>
                <th scope="col">Fecha</th>
                <th scope="col">Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    transacciones.forEach((transaccion, indice) => {
        const tr = document.createElement('tr');
        tr.className = `item-transaccion ${transaccion.tipo}`;
        tr.innerHTML = `
            <td data-label="Descripción">
                <span class="descripcion-texto">${capitalizarPalabras(transaccion.descripcion || 'Sin descripción')}</span>
                <input type="text" class="editar-descripcion" style="display: none;" value="${transaccion.descripcion || ''}">
            </td>
            <td data-label="Monto">
                <span class="monto-texto">$${formatearNumero(transaccion.monto)}</span>
                <input type="number" step="0.01" min="0.01" class="editar-monto" style="display: none;" value="${transaccion.monto}">
            </td>
            <td data-label="Tipo">${capitalizarPrimeraLetra(transaccion.tipo)}</td>
            <td data-label="Categoría">${capitalizarPalabras(transaccion.categoria)}</td>
            <td data-label="Fecha">
                <span class="fecha-texto">${formatearFechaHora(transaccion.fecha)}</span>
                <input type="datetime-local" class="editar-fecha" style="display: none;" value="${transaccion.fecha.slice(0, 16)}">
            </td>
            <td data-label="Acciones">
                <div class="acciones-transaccion">
                    <button class="boton-editar-descripcion" data-indice="${indice}" title="Editar descripción" aria-label="Editar descripción">
                        <i data-feather="edit-2"></i>
                    </button>
                    <button class="boton-editar-monto" data-indice="${indice}" title="Editar monto" aria-label="Editar monto">
                        <i data-feather="dollar-sign"></i>
                    </button>
                    <button class="boton-editar-fecha" data-indice="${indice}" title="Editar fecha" aria-label="Editar fecha">
                        <i data-feather="calendar"></i>
                    </button>
                    <button class="boton-eliminar" data-indice="${indice}" title="Eliminar transacción" aria-label="Eliminar transacción">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tabla.querySelector('tbody').appendChild(tr);
    });

    contenido.appendChild(tabla);
    seccion.appendChild(encabezado);
    seccion.appendChild(contenido);

    encabezado.addEventListener('click', () => {
        const estaExpandido = encabezado.getAttribute('aria-expanded') === 'true';
        encabezado.setAttribute('aria-expanded', !estaExpandido);

        const icono = encabezado.querySelector('.icono-colapsar');
        icono.setAttribute('data-feather', !estaExpandido ? 'chevron-down' : 'chevron-right');

        contenido.style.height = !estaExpandido ? 'auto' : '0';
        feather.replace();
    });

    encabezado.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            encabezado.click();
        }
    });

    return seccion;
};

const actualizarSelectCategorias = () => {
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = AppState.categorias
        .map(categoria => `
            <option value="${categoria.toLowerCase()}">
                ${capitalizarPalabras(categoria)}
            </option>
        `).join('');
};

// Funciones de exportación e importación
const exportarExcel = async () => {
    try {
        const ws = XLSX.utils.json_to_sheet(AppState.transacciones.map(t => ({
            Descripción: capitalizarPrimeraLetra(t.descripcion || 'Sin descripción'),
            Monto: t.monto,
            Tipo: capitalizarPrimeraLetra(t.tipo),
            Categoría: capitalizarPrimeraLetra(t.categoria),
            Fecha: new Date(t.fecha).toLocaleDateString()
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Transacciones");
        XLSX.writeFile(wb, "Control De Gastos Personales.xlsx");

        mostrarMensaje('Archivo Excel exportado con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al exportar a Excel', 'error');
        console.error('Error en exportación Excel:', error);
    }
};

const exportarPDF = async () => {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Control de Gastos Personales", 14, 15);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);
        doc.text(`Saldo Total: $${formatearNumero(AppState.saldo)}`, 14, 35);
        doc.text(`Total Ingresos: $${formatearNumero(AppState.ingresos)}`, 14, 45);
        doc.text(`Total Gastos: $${formatearNumero(AppState.gastos)}`, 14, 55);

        const columns = ["Descripción", "Monto", "Tipo", "Categoría", "Fecha"];
        const data = AppState.transacciones.map(t => [
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
        mostrarMensaje('Archivo PDF exportado con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al exportar a PDF', 'error');
        console.error('Error en exportación PDF:', error);
    }
};

const exportarJSON = async () => {
    try {
        const datos = {
            transacciones: AppState.transacciones,
            categorias: AppState.categorias
        };

        const blob = new Blob([JSON.stringify(datos, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Control De Gastos Personales.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        mostrarMensaje('Datos exportados con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al exportar los datos', 'error');
        console.error('Error en exportación JSON:', error);
    }
};

const importarExcel = async (e) => {
    try {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const transaccionesImportadas = XLSX.utils.sheet_to_json(sheet);

            AppState.transacciones = transaccionesImportadas.map(t => ({
                descripcion: t.Descripción || null,
                monto: parseFloat(t.Monto.replace('$', '')),
                tipo: t.Tipo.toLowerCase(),
                categoria: t.Categoría.toLowerCase(),
                fecha: new Date(t.Fecha).toISOString()
            }));

            await EstadoManager.recalcularTotales();
            await EstadoManager.guardarCambios();

            mostrarMensaje('Archivo Excel importado con éxito', 'success');
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        mostrarMensaje('Error al importar desde Excel', 'error');
        console.error('Error en importación Excel:', error);
    }
};

const importarPDF = async (e) => {
    try {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const pdf = await pdfjsLib.getDocument({ data: event.target.result }).promise;
            const transaccionesImportadas = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const textItems = textContent.items.map(item => item.str);

                for (let j = 0; j < textItems.length; j += 5) {
                    const transaccion = {
                        descripcion: textItems[j] || null,
                        monto: parseFloat(textItems[j + 1].replace('$', '')),
                        tipo: textItems[j + 2].toLowerCase(),
                        categoria: textItems[j + 3].toLowerCase(),
                        fecha: new Date(textItems[j + 4]).toISOString()
                    };
                    transaccionesImportadas.push(transaccion);
                }
            }

            AppState.transacciones = transaccionesImportadas;

            await EstadoManager.recalcularTotales();
            await EstadoManager.guardarCambios();

            mostrarMensaje('Archivo PDF importado con éxito', 'success');
        };
        reader.readAsArrayBuffer(file);
    } catch (error) {
        mostrarMensaje('Error al importar desde PDF', 'error');
        console.error('Error en importación PDF:', error);
    }
};

const importarJSON = async (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    try {
        mostrarCargando(); // Mostrar indicador de carga

        const contenido = await new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onload = e => resolve(e.target.result);
            lector.onerror = () => reject(new Error('Error al leer el archivo'));
            lector.readAsText(archivo);
        });

        let datos;
        try {
            datos = JSON.parse(contenido);
        } catch (e) {
            throw new Error('El archivo no contiene un JSON válido');
        }

        // Validación detallada de la estructura
        if (!datos || typeof datos !== 'object') {
            throw new Error('El archivo no contiene un objeto JSON válido');
        }

        if (!Array.isArray(datos.transacciones)) {
            throw new Error('El archivo no contiene un array de transacciones válido');
        }

        if (!Array.isArray(datos.categorias)) {
            throw new Error('El archivo no contiene un array de categorías válido');
        }

        // Validar cada transacción
        datos.transacciones.forEach((trans, index) => {
            if (!trans.monto || isNaN(parseFloat(trans.monto))) {
                throw new Error(`Transacción ${index + 1}: monto inválido`);
            }
            if (!trans.tipo || !['ingreso', 'gasto', 'transferencia'].includes(trans.tipo)) {
                throw new Error(`Transacción ${index + 1}: tipo inválido`);
            }
            if (!trans.categoria || typeof trans.categoria !== 'string') {
                throw new Error(`Transacción ${index + 1}: categoría inválida`);
            }
            if (!trans.fecha || isNaN(new Date(trans.fecha).getTime())) {
                throw new Error(`Transacción ${index + 1}: fecha inválida`);
            }
        });

        // Asegurar categorías predeterminadas
        if (!datos.categorias.includes('sin clasificar')) {
            datos.categorias.push('sin clasificar');
        }
        if (!datos.categorias.includes('otro')) {
            datos.categorias.push('otro');
        }

        // Actualizar estado
        AppState.transacciones = datos.transacciones;
        AppState.categorias = datos.categorias;

        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();

        mostrarMensaje('Datos importados con éxito', 'success');
    } catch (error) {
        mostrarMensaje(`Error al importar los datos: ${error.message}`, 'error');
        console.error('Error en importación:', error);
    } finally {
        ocultarCargando(); // Ocultar indicador de carga
    }
};

// Funciones de edición y eliminación
const memoizedFeatherReplace = (() => {
    let cache = null;
    return () => {
        if (!cache) {
            requestAnimationFrame(() => {
                feather.replace();
                cache = true;
            });
        }
    };
})();

const resetFeatherCache = () => {
    memoizedFeatherReplace.cache = null;
};

const editarDescripcion = async (indice) => {
    const transaccion = AppState.transacciones[indice];
    const fila = document.querySelector(`tr:has(button[data-indice="${indice}"].boton-editar-descripcion)`);
    if (!fila) {
        mostrarMensaje('Elemento no encontrado', 'error');
        return;
    }
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
        transaccion.descripcion = nuevaDescripcion || null;
        descripcionTexto.textContent = capitalizarPalabras(nuevaDescripcion || 'Sin descripción');
        descripcionTexto.style.display = 'inline-block';
        descripcionInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="edit-2"></i>';
        await EstadoManager.guardarCambios();
    }
    memoizedFeatherReplace();
};

const editarMonto = async (indice) => {
    const transaccion = AppState.transacciones[indice];
    const fila = document.querySelector(`tr:has(button[data-indice="${indice}"].boton-editar-monto)`);
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
            mostrarMensaje('Por favor, ingrese un monto válido mayor que 0', 'error');
            return;
        }

        transaccion.monto = nuevoMonto;
        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();

        montoTexto.textContent = `$${formatearNumero(nuevoMonto)}`;
        montoTexto.style.display = 'inline-block';
        montoInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="dollar-sign"></i>';
    }
    memoizedFeatherReplace();
};

const editarFecha = async (indice) => {
    const transaccion = AppState.transacciones[indice];
    const fila = document.querySelector(`tr:has(button[data-indice="${indice}"].boton-editar-fecha)`);
    const fechaTexto = fila.querySelector('.fecha-texto');
    const fechaInput = fila.querySelector('.editar-fecha');
    const botonEditar = fila.querySelector('.boton-editar-fecha');

    if (fechaInput.style.display === 'none') {
        fechaTexto.style.display = 'none';
        fechaInput.style.display = 'inline-block';
        fechaInput.type = 'datetime-local';
        fechaInput.value = transaccion.fecha.slice(0, 16);
        fechaInput.focus();
        botonEditar.innerHTML = '<i data-feather="check"></i>';
    } else {
        const nuevaFecha = fechaInput.value;
        if (!nuevaFecha) {
            mostrarMensaje('Por favor, seleccione una fecha y hora válida', 'error');
            return;
        }

        transaccion.fecha = new Date(nuevaFecha).toISOString();
        fechaTexto.textContent = formatearFechaHora(transaccion.fecha);
        fechaTexto.style.display = 'inline-block';
        fechaInput.style.display = 'none';
        botonEditar.innerHTML = '<i data-feather="calendar"></i>';

        await EstadoManager.guardarCambios();
    }
    memoizedFeatherReplace();
};

const confirmarEliminarTransaccion = async (indice) => {
    const transaccion = AppState.transacciones[indice];
    const mensaje = "¿Está seguro que desea eliminar esta transacción?\n\n" +
        `Descripción: ${transaccion.descripcion || 'Sin descripción'}\n` +
        `Monto: $${formatearNumero(transaccion.monto)}\n` +
        `Tipo: ${capitalizarPrimeraLetra(transaccion.tipo)}\n` +
        `Categoría: ${capitalizarPalabras(transaccion.categoria)}`;

    if (confirm(mensaje)) {
        await eliminarTransaccion(indice);
    }
};

const eliminarTransaccion = async (indice) => {
    try {
        AppState.transacciones.splice(indice, 1);
        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();
        mostrarMensaje('Transacción eliminada con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al eliminar la transacción', 'error');
        console.error('Error al eliminar transacción:', error);
    }
};

const eliminarCategoria = async (categoria) => {
    try {
        if (categoria.toLowerCase() === 'sin clasificar' || categoria.toLowerCase() === 'otro') {
            mostrarMensaje('No se pueden eliminar las categorías predeterminadas', 'error');
            return;
        }

        const index = AppState.categorias.findIndex(
            cat => cat.toLowerCase() === categoria.toLowerCase()
        );

        if (index === -1) {
            mostrarMensaje('Categoría no encontrada', 'error');
            return;
        }

        // Mover transacciones a "sin clasificar"
        AppState.transacciones = AppState.transacciones.map(trans => {
            if (trans.categoria.toLowerCase() === categoria.toLowerCase()) {
                return { ...trans, categoria: 'sin clasificar' };
            }
            return trans;
        });

        AppState.categorias.splice(index, 1);

        await EstadoManager.recalcularTotales();
        await EstadoManager.guardarCambios();

        mostrarMensaje('Categoría eliminada con éxito', 'success');
    } catch (error) {
        mostrarMensaje('Error al eliminar la categoría', 'error');
        console.error('Error al eliminar categoría:', error);
    }
};

// Funciones de UI
const mostrarCargando = () => {
    const cargando = document.createElement('div');
    cargando.className = 'cargando';
    cargando.innerHTML = `
        <div class="cargando-contenido">
            <div class="cargando-spinner"></div>
            <p>Procesando datos...</p>
        </div>
    `;
    document.body.appendChild(cargando);
};

const ocultarCargando = () => {
    const cargando = document.querySelector('.cargando');
    if (cargando) {
        cargando.remove();
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el estado de la aplicación y configurar eventos
    EstadoManager.inicializar();
    feather.replace();
    resetFeatherCache();

    // Agregar evento de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Configurar eventos del formulario principal
    document.getElementById('formulario-transaccion')
        .addEventListener('submit', handleSubmitFormulario);

    document.getElementById('categoria')
        .addEventListener('change', handleCategoriaChange);

    // Configurar eventos de exportación
    document.getElementById('exportar-excel')
        .addEventListener('click', exportarExcel);

    document.getElementById('exportar-pdf')
        .addEventListener('click', exportarPDF);

    document.getElementById('exportar-json')
        .addEventListener('click', exportarJSON);

    document.getElementById('importar-json')
        .addEventListener('change', importarJSON);

    // Botones del modal de transferencia
    document.getElementById('abrir-modal-transferencia')
        .addEventListener('click', () => {
            const modal = document.getElementById('modal-transferencia');
            const selectOrigen = document.getElementById('categoria-origen');
            const selectDestino = document.getElementById('categoria-destino');

            // Actualizar las opciones de categorías
            const optionsHTML = AppState.categorias
                .map(categoria => `<option value="${categoria}">${capitalizarPalabras(categoria)}</option>`)
                .join('');

            selectOrigen.innerHTML = optionsHTML;
            selectDestino.innerHTML = optionsHTML;

            modal.classList.remove('hidden');
        });

    document.getElementById('cerrar-modal-transferencia')
        .addEventListener('click', () => {
            document.getElementById('modal-transferencia').classList.add('hidden');
            document.getElementById('formulario-transferencia').reset();
        });

    // Cerrar modal al hacer clic fuera del contenido
    document.getElementById('modal-transferencia').addEventListener('click', (e) => {
        if (e.target.id === 'modal-transferencia') {
            e.target.classList.add('hidden');
            document.getElementById('formulario-transferencia').reset();
        }
    });

    // Delegación de eventos para acciones dinámicas
    document.addEventListener('click', async (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        const indice = target.dataset.indice;
        if (!indice && !target.classList.contains('boton-eliminar-categoria')) return;

        if (target.classList.contains('boton-eliminar')) {
            await confirmarEliminarTransaccion(indice);
        } else if (target.classList.contains('boton-editar-descripcion')) {
            await editarDescripcion(indice);
        } else if (target.classList.contains('boton-editar-monto')) {
            await editarMonto(indice);
        } else if (target.classList.contains('boton-editar-fecha')) {
            await editarFecha(indice);
        } else if (target.classList.contains('boton-eliminar-categoria')) {
            const categoria = target.dataset.categoria;
            await eliminarCategoria(categoria);
        }
    });

    // Agregar evento para la transferencia entre categorías
    document.getElementById('formulario-transferencia')
        .addEventListener('submit', transferirEntreCategorias);
});

// Transferencia entre categorías
const transferirEntreCategorias = async (e) => {
    e.preventDefault();

    const monto = parseFloat(document.getElementById('monto-transferencia').value);
    const categoriaOrigen = document.getElementById('categoria-origen').value;
    const categoriaDestino = document.getElementById('categoria-destino').value;

    if (isNaN(monto) || monto <= 0) {
        mostrarMensaje('Ingrese un monto válido mayor que 0', 'error');
        return;
    }

    if (categoriaOrigen === categoriaDestino) {
        mostrarMensaje('La categoría de origen y destino no pueden ser iguales', 'error');
        return;
    }

    // Verificar si hay saldo suficiente en la categoría origen
    if (!AppState.resumenCategoria[categoriaOrigen] || AppState.resumenCategoria[categoriaOrigen] < monto) {
        mostrarMensaje('Saldo insuficiente en la categoría origen', 'error');
        return;
    }

    // Verificar si la categoría de origen tiene transacciones
    const tieneTransacciones = AppState.transacciones.some(trans => trans.categoria === categoriaOrigen);
    if (!tieneTransacciones) {
        mostrarMensaje('La categoría de origen no tiene transacciones', 'error');
        return;
    }

    // Crear transacción de salida (origen)
    const transaccionOrigen = {
        descripcion: `Transferencia hacia ${capitalizarPalabras(categoriaDestino)}`,
        monto: monto,
        tipo: 'gasto',
        categoria: categoriaOrigen,
        fecha: new Date().toISOString()
    };

    // Crear transacción de entrada (destino)
    const transaccionDestino = {
        descripcion: `Transferencia desde ${capitalizarPalabras(categoriaOrigen)}`,
        monto: monto,
        tipo: 'ingreso',
        categoria: categoriaDestino,
        fecha: new Date().toISOString()
    };

    // Agregar ambas transacciones
    AppState.transacciones.push(transaccionOrigen, transaccionDestino);

    // Recalcular totales y actualizar UI
    await EstadoManager.recalcularTotales();
    await EstadoManager.guardarCambios();

    // Cerrar modal y mostrar mensaje de éxito
    document.getElementById('modal-transferencia').classList.add('hidden');
    document.getElementById('formulario-transferencia').reset();
    mostrarMensaje('Transferencia realizada con éxito', 'success');
};
