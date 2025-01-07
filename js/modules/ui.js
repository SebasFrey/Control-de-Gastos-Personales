import { AppState, EstadoManager } from './estado.js';
import {
  formatearNumero,
  formatearFechaHora,
  capitalizarPalabras
} from '../utils/formatters.js';

export class UIManager {
  static actualizarSaldo() {
    requestAnimationFrame(() => {
      document.getElementById('saldo').textContent = formatearNumero(AppState.saldo);
      document.getElementById('ingresos').textContent = formatearNumero(AppState.ingresos);
      document.getElementById('gastos').textContent = formatearNumero(AppState.gastos);
    });
  }

  static actualizarResumenCategoria() {
    const listaCategoria = document.getElementById('lista-categoria');
    const fragmento = document.createDocumentFragment();

    Object.entries(AppState.resumenCategoria).forEach(([categoria, monto]) => {
      const li = document.createElement('li');
      li.className = 'categoria-item';
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
      fragmento.appendChild(li);
    });

    // Batch DOM updates
    requestAnimationFrame(() => {
      listaCategoria.innerHTML = '';
      listaCategoria.appendChild(fragmento);
      feather.replace();
    });
  }

  static actualizarListaTransacciones() {
    const listaTransacciones = document.getElementById('lista-transacciones');
    const fragmento = document.createDocumentFragment();

    // Group transactions by date using a more efficient method
    const transaccionesPorFecha = AppState.transacciones.reduce((acc, trans) => {
      const fecha = new Date(trans.fecha).toLocaleDateString();
      (acc[fecha] = acc[fecha] || []).push(trans);
      return acc;
    }, {});

    Object.entries(transaccionesPorFecha)
      .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
      .forEach(([fecha, transacciones]) => {
        const seccion = this.crearSeccionFecha(fecha, transacciones);
        fragmento.appendChild(seccion);
      });

    // Batch DOM updates
    requestAnimationFrame(() => {
      listaTransacciones.innerHTML = '';
      listaTransacciones.appendChild(fragmento);
      feather.replace();
    });
  }

  static crearSeccionFecha(fecha, transacciones) {
    const seccion = document.createElement('div');
    seccion.className = 'seccion-fecha';

    const esHoy = fecha === new Date().toLocaleDateString();
    const contenidoHeight = this.calcularAlturaContenido(transacciones.length);

    seccion.innerHTML = `
      <div class="encabezado-fecha"
           aria-expanded="${esHoy}"
           role="button"
           tabindex="0">
        <div class="fecha-collapse">
          <i data-feather="${esHoy ? 'chevron-down' : 'chevron-right'}"
             class="icono-colapsar"></i>
          <span>${esHoy ? 'Hoy' : fecha}</span>
        </div>
        <span class="resumen-fecha">${transacciones.length} transacción(es)</span>
      </div>
      <div class="contenido-fecha"
           style="height: ${esHoy ? contenidoHeight : '0'}px">
        ${this.crearTablaTransacciones(transacciones)}
      </div>`;

    const encabezado = seccion.querySelector('.encabezado-fecha');
    const contenido = seccion.querySelector('.contenido-fecha');

    encabezado.addEventListener('click', () => {
      const estaExpandido = encabezado.getAttribute('aria-expanded') === 'true';

      if (!estaExpandido) {
        contenido.style.height = 'auto';
        const altura = contenido.scrollHeight;
        contenido.style.height = '0';
        contenido.offsetHeight; // Forzar un reflow
        contenido.style.height = altura + 'px';
      } else {
        contenido.style.height = '0';
      }

      encabezado.setAttribute('aria-expanded', !estaExpandido);
    });

    encabezado.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        encabezado.click();
      }
    });

    return seccion;
  }

  static calcularAlturaContenido(numTransacciones) {
    // Calculate dynamic height based on number of transactions
    const alturaBase = 48; // Base height for header
    const alturaTransaccion = 72; // Height per transaction
    return alturaBase + (alturaTransaccion * numTransacciones);
  }

  static mostrarMensaje(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('notificaciones');
    const mensajeElement = document.createElement('div');

    mensajeElement.className = `notificacion notificacion-${tipo}`;
    mensajeElement.textContent = mensaje;
    mensajeElement.setAttribute('role', 'alert');
    mensajeElement.setAttribute('aria-live', 'assertive');

    requestAnimationFrame(() => {
      contenedor.appendChild(mensajeElement);
      setTimeout(() => mensajeElement.remove(), 3000);
    });
  }

  static toggleCargando(mostrar = true) {
    const id = 'cargando-overlay';
    let cargando = document.getElementById(id);

    if (mostrar && !cargando) {
      cargando = document.createElement('div');
      cargando.id = id;
      cargando.className = 'cargando';
      cargando.innerHTML = `
        <div class="cargando-contenido" role="alert" aria-live="polite">
          <div class="cargando-spinner" aria-hidden="true"></div>
          <p>Procesando datos...</p>
        </div>`;
      document.body.appendChild(cargando);
    } else if (!mostrar && cargando) {
      cargando.remove();
    }
  }
}

function myFunction() {
  console.log("This is a sample function.");
  const formattedNumber = formatearNumero(12345.67);

  console.log(formattedNumber); // Example usage of imported function
}

myFunction();

