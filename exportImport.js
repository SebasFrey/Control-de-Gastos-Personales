import { AppState, EstadoManager } from './estadoManager.js';
import { formatearNumero, capitalizarPrimeraLetra, capitalizarPalabras, mostrarMensaje, mostrarCargando, ocultarCargando } from './utils.js';

export const exportarExcel = async () => {
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

export const exportarPDF = async () => {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.text("Control de Gastos Personales", 14, 15);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 25);
        doc.text(`Saldo Total: $${formatearNumero(AppState.saldo)}`, 14, 35);
        doc.text(`Total Ingresos: $${formatearNumero(AppState.ingresos)}`, 14, 45);
        doc.text(`Total Gastos: $${formatearNumero(AppState.gastos)}`, 14, 55);

        const columns = ["Descripción", "Monto", "Tipo", "Categoría", "Fecha"];
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

export const exportarJSON = async () => {
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

export const importarJSON = async (evento) => {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    try {
        mostrarCargando();

        const contenido = await new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.onload = e => resolve(e.target.result);
            lector.onerror = () => reject(new Error('Error al leer el archivo'));
            lector.readAsText(archivo);
        });

        const datos = JSON.parse(contenido);

        if (!datos.transacciones || !Array.isArray(datos.transacciones) ||
            !datos.categorias || !Array.isArray(datos.categorias)) {
            throw new Error('Formato de archivo inválido');
        }

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
        mostrarMensaje('Error al importar los datos', 'error');
        console.error('Error en importación:', error);
    } finally {
        ocultarCargando();
    }
};

export const transferirEntreCategorias = async (e) => {
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

    // Crear transacción de salida (origen)
    const transaccionOrigen = {
        descripcion: `Transferencia hacia ${capitalizarPalabras(categoriaDestino)}`,
        monto: monto,
        tipo: 'transferencia',
        categoria: categoriaOrigen,
        fecha: new Date().toISOString()
    };

    // Crear transacción de entrada (destino)
    const transaccionDestino = {
        descripcion: `Transferencia desde ${capitalizarPalabras(categoriaOrigen)}`,
        monto: monto,
        tipo: 'transferencia',
        categoria: categoriaDestino,
        fecha: new Date().toISOString()
    };

    // Agregar ambas transacciones
    AppState.transacciones.push(transaccionOrigen, transaccionDestino);

    // Actualizar saldos de categorías sin afectar totales de ingresos y gastos
    AppState.resumenCategoria[categoriaOrigen] -= monto;
    AppState.resumenCategoria[categoriaDestino] += monto;

    // Guardar cambios y actualizar UI
    await EstadoManager.guardarCambios();

    // Cerrar modal y mostrar mensaje de éxito
    document.getElementById('modal-transferencia').classList.add('hidden');
    document.getElementById('formulario-transferencia').reset();
    mostrarMensaje('Transferencia realizada con éxito', 'success');
};

