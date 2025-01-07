import { UIManager } from './ui.js';
import { debounce, throttle } from '../utilidades.js';

export class MobileUIManager extends UIManager {
  static inicializar() {
    this.setupPullToRefresh();
    this.setupBottomNavigation();
    this.setupTouchInteractions();
    this.setupMobileForm();
    this.setupFloatingActionButton();
  }

  static setupPullToRefresh() {
    let startY = 0;
    let pulling = false;
    const content = document.querySelector('main');
    const indicator = document.createElement('div');
    indicator.className = 'pull-to-refresh hidden';
    indicator.innerHTML = '<div class="pull-to-refresh-spinner"></div>';
    document.body.insertBefore(indicator, content);

    content.addEventListener('touchstart', (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
        pulling = true;
      }
    }, { passive: true });

    content.addEventListener('touchmove', (e) => {
      if (!pulling) return;

      const currentY = e.touches[0].pageY;
      const pullDistance = currentY - startY;

      if (pullDistance > 0 && pullDistance < 50) {
        indicator.classList.remove('hidden');
        indicator.style.transform = `translateY(${pullDistance}px)`;
      }
    });

    content.addEventListener('touchend', async () => {
      if (!pulling) return;

      pulling = false;
      indicator.classList.add('hidden');
      indicator.style.transform = '';

      if (indicator.offsetHeight >= 50) {
        await this.refreshData();
      }
    });
  }

  static setupBottomNavigation() {
    const nav = document.createElement('nav');
    nav.className = 'navegacion-inferior';
    nav.innerHTML = `
      <div class="navegacion-inferior-contenido">
        <a href="#seccion-formulario" class="navegacion-inferior-item activo">
          <i data-feather="plus-circle"></i>
          <span>Nuevo</span>
        </a>
        <a href="#seccion-resumen" class="navegacion-inferior-item">
          <i data-feather="pie-chart"></i>
          <span>Resumen</span>
        </a>
        <a href="#seccion-historial" class="navegacion-inferior-item">
          <i data-feather="list"></i>
          <span>Historial</span>
        </a>
      </div>
    `;

    document.body.appendChild(nav);
    feather.replace();

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        document.getElementById(targetId).scrollIntoView({
          behavior: 'smooth'
        });

        nav.querySelectorAll('.navegacion-inferior-item').forEach(item => {
          item.classList.remove('activo');
        });
        link.classList.add('activo');
      });
    });
  }

  static setupTouchInteractions() {
    document.querySelectorAll('.seccion-fecha').forEach(seccion => {
      let touchStartX = 0;
      let touchStartY = 0;
      let currentTranslate = 0;

      seccion.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      seccion.addEventListener('touchmove', (e) => {
        if (!touchStartX || !touchStartY) return;

        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // If horizontal swipe is greater than vertical
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          e.preventDefault();
          currentTranslate = Math.max(-80, Math.min(0, deltaX));
          seccion.style.transform = `translateX(${currentTranslate}px)`;
        }
      });

      seccion.addEventListener('touchend', () => {
        if (currentTranslate < -40) {
          this.showSwipeActions(seccion);
        } else {
          this.hideSwipeActions(seccion);
        }

        currentTranslate = 0;
        touchStartX = 0;
        touchStartY = 0;
      });
    });
  }

  static setupMobileForm() {
    const inputs = document.querySelectorAll('input, select');

    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        setTimeout(() => {
          input.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300);
      });

      input.addEventListener('blur', () => {
        window.scrollTo(0, 0);
      });
    });
  }

  static setupFloatingActionButton() {
    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = '<i data-feather="plus"></i>';
    fab.setAttribute('aria-label', 'Nueva transacción');

    fab.addEventListener('click', () => {
      document.getElementById('seccion-formulario')
        .scrollIntoView({ behavior: 'smooth' });
    });

    document.body.appendChild(fab);
    feather.replace();
  }

  static showSwipeActions(seccion) {
    const actions = document.createElement('div');
    actions.className = 'swipe-actions';
    actions.innerHTML = `
      <button class="editar">
        <i data-feather="edit-2"></i>
      </button>
      <button class="eliminar">
        <i data-feather="trash-2"></i>
      </button>
    `;

    seccion.appendChild(actions);
    requestAnimationFrame(() => {
      actions.style.transform = 'translateX(0)';
      feather.replace();
    });
  }

  static hideSwipeActions(seccion) {
    const actions = seccion.querySelector('.swipe-actions');
    if (actions) {
      actions.style.transform = 'translateX(100%)';
      actions.addEventListener('transitionend', () => {
        actions.remove();
      });
    }
  }

  static refreshData = debounce(async () => {
    try {
      this.mostrarIndicadorCarga();
      await EstadoManager.recalcularTotales();
      await this.actualizarUI();
      this.mostrarMensaje('Datos actualizados', 'success');
    } catch (error) {
      this.mostrarMensaje('Error al actualizar', 'error');
    } finally {
      this.ocultarIndicadorCarga();
    }
  }, 300);
}

