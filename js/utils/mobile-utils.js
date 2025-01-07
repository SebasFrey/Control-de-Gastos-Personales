export const detectarDispositivo = () => {
  const ua = navigator.userAgent;
  if (/Android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  return 'desktop';
};

export const ajustarAlturaVentana = () => {
  // Fix for mobile viewport height issues
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export const manejarZoomTactil = (element) => {
  let initialDistance = 0;
  let initialScale = 1;

  element.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      initialDistance = obtenerDistanciaTactil(e.touches[0], e.touches[1]);
    }
  });

  element.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      const currentDistance = obtenerDistanciaTactil(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;

      if (scale !== 1) {
        e.preventDefault();
        element.style.transform = `scale(${initialScale * scale})`;
      }
    }
  });

  element.addEventListener('touchend', () => {
    initialDistance = 0;
    element.style.transform = '';
  });
};

const obtenerDistanciaTactil = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.hypot(dx, dy);
};

export const optimizarRendimiento = () => {
  // Detect slow devices
  const isLowEnd = navigator.hardwareConcurrency < 4;

  if (isLowEnd) {
    // Reduce animations
    document.body.classList.add('reducir-animaciones');

    // Disable certain features
    window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
  }

  // Optimize images
  document.querySelectorAll('img').forEach(img => {
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
    }
    if ('decoding' in HTMLImageElement.prototype) {
      img.decoding = 'async';
    }
  });
};

export const manejarEventosTactiles = (elemento, handlers) => {
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  elemento.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  elemento.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    const deltaTime = touchEndTime - touchStartTime;

    // Detectar tipo de gesto
    if (deltaTime < 250) { // Gesto rápido
      if (Math.abs(deltaX) > 30 && Math.abs(deltaY) < 30) {
        // Swipe horizontal
        if (deltaX > 0 && handlers.swipeRight) {
          handlers.swipeRight();
        } else if (deltaX < 0 && handlers.swipeLeft) {
          handlers.swipeLeft();
        }
      } else if (Math.abs(deltaY) > 30 && Math.abs(deltaX) < 30) {
        // Swipe vertical
        if (deltaY > 0 && handlers.swipeDown) {
          handlers.swipeDown();
        } else if (deltaY < 0 && handlers.swipeUp) {
          handlers.swipeUp();
        }
      }
    }
  });
};

