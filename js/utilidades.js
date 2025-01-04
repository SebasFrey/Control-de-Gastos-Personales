// Formatting utilities
export const formatearNumero = (numero) => {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numero.toFixed(2));
};

export const formatearFechaHora = (fecha) => {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const capitalizarPrimeraLetra = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/^\w/, c => c.toUpperCase());
};

export const capitalizarPalabras = (str) => {
  if (!str) return '';
  return str.toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Validation utilities
export const validarFormulario = (formData) => {
  const errores = {};

  // Validate amount
  const monto = parseFloat(formData.get('monto'));
  if (!monto || monto <= 0) {
    errores.monto = 'Ingrese un monto válido mayor que 0';
  }

  // Validate type
  const tipo = formData.get('tipo');
  if (!['ingreso', 'gasto'].includes(tipo)) {
    errores.tipo = 'Seleccione un tipo válido';
  }

  // Validate category
  const categoria = formData.get('categoria');
  if (!categoria) {
    errores.categoria = 'Seleccione una categoría';
  }

  // Validate new category if needed
  if (categoria === 'otro') {
    const otraCategoria = formData.get('otra-categoria');
    if (!otraCategoria || otraCategoria.length < 2) {
      errores.otraCategoria = 'Ingrese un nombre válido para la categoría (mínimo 2 caracteres)';
    }
  }

  return errores;
};

export const validarMontoEnTiempoReal = (input) => {
  const monto = parseFloat(input.value);
  const esValido = !isNaN(monto) && monto > 0;

  if (!esValido) {
    input.classList.add('input-error');
    mostrarError(input, 'Ingrese un monto válido mayor que 0');
  } else {
    input.classList.remove('input-error');
    ocultarError(input);
  }

  return esValido;
};

export const validarFecha = (fecha) => {
  const nuevaFecha = new Date(fecha);
  return !isNaN(nuevaFecha.getTime());
};

// DOM utilities
export const crearElemento = (tag, attributes = {}, children = []) => {
  const element = document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });

  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
};

// State and UI update utilities
export const actualizarEstadoYUI = async () => {
  await EstadoManager.recalcularTotales();
  await EstadoManager.guardarCambios();
  actualizarUI();
};

// Error handling utilities
export const mostrarError = (elemento, mensaje) => {
  const contenedorError = document.createElement('div');
  contenedorError.className = 'mensaje-error visible';
  contenedorError.textContent = mensaje;
  elemento.parentNode.appendChild(contenedorError);
};

export const ocultarError = (elemento) => {
  const contenedorError = elemento.parentNode.querySelector('.mensaje-error');
  if (contenedorError) {
    contenedorError.remove();
  }
};
