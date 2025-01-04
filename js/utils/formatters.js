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

