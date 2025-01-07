export class HistorialManager {
  static calcularAlturaContenido(elemento) {
    // Clonar el elemento para medir su altura real
    const clon = elemento.cloneNode(true);
    clon.style.height = 'auto';
    clon.style.position = 'absolute';
    clon.style.visibility = 'hidden';
    document.body.appendChild(clon);

    const altura = clon.scrollHeight;
    document.body.removeChild(clon);

    return altura;
  }

  static async toggleSeccion(encabezado) {
    const contenido = encabezado.nextElementSibling;
    const estaExpandido = encabezado.getAttribute('aria-expanded') === 'true';

    // Calcular altura antes de la transición
    const altura = this.calcularAlturaContenido(contenido);

    // Configurar la transición
    contenido.style.transition = 'height 0.3s ease-in-out';

    if (!estaExpandido) {
      // Expandir
      contenido.style.height = '0';
      // Forzar reflow
      contenido.offsetHeight;
      contenido.style.height = `${altura}px`;
    } else {
      // Colapsar
      contenido.style.height = `${contenido.scrollHeight}px`;
      // Forzar reflow
      contenido.offsetHeight;
      contenido.style.height = '0';
    }

    // Actualizar estado
    encabezado.setAttribute('aria-expanded', !estaExpandido);

    // Limpiar altura después de la transición
    contenido.addEventListener('transitionend', () => {
      if (!estaExpandido) {
        contenido.style.height = 'auto';
      }
    }, { once: true });
  }

  static inicializarEventos() {
    document.querySelectorAll('.encabezado-fecha').forEach(encabezado => {
      encabezado.addEventListener('click', () => this.toggleSeccion(encabezado));
      encabezado.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleSeccion(encabezado);
        }
      });
    });
  }
}
