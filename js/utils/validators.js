export const validarMonto = (valor) => {
  const monto = parseFloat(valor);
  return !isNaN(monto) && monto > 0;
};

export const validarFecha = (valor) => {
  const fecha = new Date(valor);
  return !isNaN(fecha.getTime());
};

export const validarFormulario = (formData) => {
  const errores = {};

  // Validate amount
  const monto = parseFloat(formData.get('monto'));
  if (!validarMonto(monto)) {
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

