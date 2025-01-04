export const validarMonto = (valor) => {
  const monto = parseFloat(valor);
  return !isNaN(monto) && monto > 0;
};

export const validarFecha = (valor) => {
  const fecha = new Date(valor);
  return !isNaN(fecha.getTime());
};

export const validarTransferencia = (formData) => {
  const errores = [];

  const monto = parseFloat(formData.get('monto-transferencia'));
  if (!validarMonto(monto)) {
    errores.push('El monto debe ser mayor que 0');
  }

  const origen = formData.get('categoria-origen');
  const destino = formData.get('categoria-destino');

  if (!origen || !destino) {
    errores.push('Seleccione las categorías de origen y destino');
  } else if (origen === destino) {
    errores.push('Las categorías deben ser diferentes');
  }

  return {
    esValido: errores.length === 0,
    errores
  };
};

