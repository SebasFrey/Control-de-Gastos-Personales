import { formatearNumero, formatearFechaHora, capitalizarPalabras } from './utils.js';
import { AppState, EstadoManager } from './estadoManager.js';

export const actualizarSaldo = () => {
    document.getElementById('saldo').textContent = formatearNumero(AppState.saldo);
    document.getElementById('ingresos').textContent = formatearNumero(AppState.ingresos);
    document.getElementById('gastos').textContent = formatearNumero(AppState.gastos);
};

export const actualizarResumenCategoria = () => {
    const listaCategoria = document.getElementById('lista-categoria');
    listaCategoria.innerHTML = '';

    Object.entries(AppState.resumenCategoria).forEach(([categoria, monto]) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="categoria-item">
                <span class="categoria-nombre">${capitalizarPalabras(categoria)}</span>
                <div class="categoria-acciones">
                    <span class="categoria-monto ${monto >= 0 ? 'ingreso' : 'gasto'}">
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

export const actualizarListaTransacciones = () => {
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

    // Ordenar fechas de más reciente a más antigua
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

export const crearSeccionFecha = (fecha, transacciones) => {
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

    // Set initial state
    if (!esHoy) {
        contenido.style.height = '0';
    } else {
        // For today's transactions, show them expanded
        contenido.style.height = 'auto';
    }

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

        // Calculate and set the height
        if (!estaExpandido) {
            // First set height to auto to get the natural height
            contenido.style.height = 'auto';
            const alturaReal = contenido.scrollHeight;
            // Then set back to 0 and force a reflow
            contenido.style.height = '0';
            contenido.offsetHeight; // Force reflow
            // Finally set to the calculated height
            contenido.style.height = alturaReal + 'px';
        } else {
            contenido.style.height = '0';
        }

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

export const actualizarSelectCategorias = () => {
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = AppState.categorias
        .map(categoria => `
            <option value="${categoria.toLowerCase()}">
                ${capitalizarPalabras(categoria)}
            </option>
        `).join('');
};
