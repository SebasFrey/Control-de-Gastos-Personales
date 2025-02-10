// Estado global de la aplicación
const AppState = {
    transacciones: [],
    categorias: ["sin clasificar", "otro"],
    saldo: 0,
    ingresos: 0,
    gastos: 0,
    resumenCategoria: {},
  }

  // Funciones de utilidad
  const formatearNumero = (numero) => {
    return new Intl.NumberFormat("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numero)
  }

  const formatearFechaHora = (fecha) => {
    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const capitalizarPrimeraLetra = (str) => {
    if (!str) return ""
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  const capitalizarPalabras = (str) => {
    if (!str) return ""
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Gestión del estado y localStorage
  const EstadoManager = {
    async inicializar() {
      try {
        const transaccionesGuardadas = localStorage.getItem("transacciones")
        const categoriasGuardadas = localStorage.getItem("categorias")

        if (transaccionesGuardadas) {
          AppState.transacciones = JSON.parse(transaccionesGuardadas)
        }
        if (categoriasGuardadas) {
          AppState.categorias = JSON.parse(categoriasGuardadas)
          if (!AppState.categorias.includes("sin clasificar")) {
            AppState.categorias.unshift("sin clasificar")
          }
          if (!AppState.categorias.includes("otro")) {
            AppState.categorias.push("otro")
          }
        }

        await this.recalcularTotales()
        this.actualizarUI()
      } catch (error) {
        mostrarMensaje("Error al cargar los datos guardados", "error")
        console.error("Error en inicialización:", error)
      }
    },

    async recalcularTotales() {
      AppState.ingresos = 0
      AppState.gastos = 0
      AppState.resumenCategoria = {}

      AppState.transacciones.forEach((transaccion) => {
        const monto = Number.parseFloat(transaccion.monto)
        if (transaccion.tipo === "ingreso") {
          AppState.ingresos += monto
        } else {
          AppState.gastos += monto
        }

        const categoria = transaccion.categoria.toLowerCase()
        if (!AppState.resumenCategoria[categoria]) {
          AppState.resumenCategoria[categoria] = 0
        }

        if (transaccion.tipo === "ingreso") {
          AppState.resumenCategoria[categoria] += monto
        } else {
          AppState.resumenCategoria[categoria] -= monto
        }
      })

      AppState.saldo = AppState.ingresos - AppState.gastos
    },

    async guardarCambios() {
      try {
        localStorage.setItem("transacciones", JSON.stringify(AppState.transacciones))
        localStorage.setItem("categorias", JSON.stringify(AppState.categorias))
        await this.recalcularTotales()
        this.actualizarUI()
      } catch (error) {
        mostrarMensaje("Error al guardar los cambios", "error")
        console.error("Error al guardar:", error)
      }
    },

    actualizarUI() {
      actualizarSaldo()
      actualizarResumenCategoria()
      actualizarListaTransacciones()
      actualizarSelectCategorias()
    },
  }

  // Funciones de UI
  const mostrarMensaje = (mensaje, tipo = "success") => {
    const contenedor = document.getElementById("mensajes")
    const mensajeElement = document.createElement("div")
    mensajeElement.className = `mensaje mensaje-${tipo}`
    mensajeElement.textContent = mensaje
    contenedor.appendChild(mensajeElement)

    setTimeout(() => {
      mensajeElement.remove()
    }, 3000)
  }

  const actualizarSaldo = () => {
    document.getElementById("saldo").textContent = formatearNumero(AppState.saldo)
    document.getElementById("ingresos").textContent = formatearNumero(AppState.ingresos)
    document.getElementById("gastos").textContent = formatearNumero(AppState.gastos)
  }

  const actualizarResumenCategoria = () => {
    const listaCategoria = document.getElementById("lista-categoria")
    listaCategoria.innerHTML = ""

    Object.entries(AppState.resumenCategoria).forEach(([categoria, monto]) => {
      const li = document.createElement("li")
      li.className = "categoria-item"
      li.classList.add(monto >= 0 ? "ingreso" : "gasto")

      li.innerHTML = `
              <div class="categoria-info">
                  <span class="categoria-nombre">${capitalizarPalabras(categoria)}</span>
                  <span class="categoria-monto">${formatearNumero(Math.abs(monto))}</span>
              </div>
              ${
                categoria !== "sin clasificar" && categoria !== "otro"
                  ? `
                  <button class="boton-eliminar-categoria" data-categoria="${categoria}">
                      <i data-feather="trash-2"></i>
                  </button>
              `
                  : ""
              }
          `

      listaCategoria.appendChild(li)
    })

    feather.replace()
  }

  const actualizarListaTransacciones = () => {
    const listaTransacciones = document.getElementById("lista-transacciones")
    listaTransacciones.innerHTML = ""

    const transaccionesPorFecha = AppState.transacciones.reduce((acc, trans) => {
      const fecha = new Date(trans.fecha).toLocaleDateString()
      if (!acc[fecha]) acc[fecha] = []
      acc[fecha].push(trans)
      return acc
    }, {})

    Object.entries(transaccionesPorFecha)
      .sort(([fechaA], [fechaB]) => new Date(fechaB) - new Date(fechaA))
      .forEach(([fecha, transacciones]) => {
        const seccion = document.createElement("div")
        seccion.className = "seccion-fecha tarjeta"

        const esHoy = fecha === new Date().toLocaleDateString()
        seccion.innerHTML = `
                  <h3 class="fecha-titulo">${esHoy ? "Hoy" : fecha}</h3>
                  <table class="tabla-transacciones-dia">
                      <thead>
                          <tr>
                              <th>Descripción</th>
                              <th>Monto</th>
                              <th>Tipo</th>
                              <th>Categoría</th>
                              <th>Acciones</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${transacciones
                            .map(
                              (t, index) => `
                              <tr>
                                  <td>${t.descripcion || "Sin descripción"}</td>
                                  <td class="${t.tipo}">${formatearNumero(t.monto)}</td>
                                  <td>${capitalizarPrimeraLetra(t.tipo)}</td>
                                  <td>${capitalizarPalabras(t.categoria)}</td>
                                  <td>
                                      <button class="boton-eliminar" data-index="${index}">
                                          <i data-feather="trash-2"></i>
                                      </button>
                                  </td>
                              </tr>
                          `,
                            )
                            .join("")}
                      </tbody>
                  </table>
              `

        listaTransacciones.appendChild(seccion)
      })

    feather.replace()
  }

  const actualizarSelectCategorias = () => {
    const selects = ["categoria", "categoria-origen", "categoria-destino"]
      .map((id) => document.getElementById(id))
      .filter((el) => el)

    const options = AppState.categorias
      .map((cat) => `<option value="${cat}">${capitalizarPalabras(cat)}</option>`)
      .join("")

    selects.forEach((select) => {
      if (select) select.innerHTML = options
    })
  }

  // Manejadores de eventos
  const handleSubmitFormulario = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new FormData(form)

    const monto = Number.parseFloat(formData.get("monto"))
    if (!monto || monto <= 0) {
      mostrarMensaje("Por favor ingrese un monto válido", "error")
      return
    }

    let categoria = formData.get("categoria")
    if (categoria === "otro") {
      const nuevaCategoria = formData.get("otra-categoria")?.trim().toLowerCase()
      if (!nuevaCategoria) {
        mostrarMensaje("Por favor ingrese un nombre para la nueva categoría", "error")
        return
      }
      if (!AppState.categorias.includes(nuevaCategoria)) {
        AppState.categorias.push(nuevaCategoria)
      }
      categoria = nuevaCategoria
    }

    const nuevaTransaccion = {
      monto,
      tipo: formData.get("tipo"),
      categoria,
      descripcion: formData.get("descripcion"),
      fecha: new Date().toISOString(),
    }

    AppState.transacciones.push(nuevaTransaccion)
    await EstadoManager.guardarCambios()

    form.reset()
    document.getElementById("contenedor-otra-categoria").style.display = "none"
    mostrarMensaje("Transacción agregada con éxito")
  }

  const handleCategoriaChange = (e) => {
    const contenedorOtraCategoria = document.getElementById("contenedor-otra-categoria")
    contenedorOtraCategoria.style.display = e.target.value === "otro" ? "block" : "none"
  }

  const eliminarTransaccion = async (index) => {
    if (confirm("¿Está seguro de eliminar esta transacción?")) {
      AppState.transacciones.splice(index, 1)
      await EstadoManager.guardarCambios()
      mostrarMensaje("Transacción eliminada con éxito")
    }
  }

  const eliminarCategoria = async (categoria) => {
    if (categoria === "sin clasificar" || categoria === "otro") {
      mostrarMensaje("No se pueden eliminar las categorías predeterminadas", "error")
      return
    }

    if (confirm(`¿Está seguro de eliminar la categoría "${categoria}"?`)) {
      AppState.transacciones = AppState.transacciones.map((trans) => ({
        ...trans,
        categoria: trans.categoria === categoria ? "sin clasificar" : trans.categoria,
      }))

      AppState.categorias = AppState.categorias.filter((cat) => cat !== categoria)
      await EstadoManager.guardarCambios()
      mostrarMensaje("Categoría eliminada con éxito")
    }
  }

  // Exportación e importación
  const exportarExcel = async () => {
    try {
      const ws = XLSX.utils.json_to_sheet(
        AppState.transacciones.map((t) => ({
          Fecha: formatearFechaHora(t.fecha),
          Descripción: t.descripcion || "Sin descripción",
          Monto: t.monto,
          Tipo: capitalizarPrimeraLetra(t.tipo),
          Categoría: capitalizarPalabras(t.categoria),
        })),
      )

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Transacciones")
      XLSX.writeFile(wb, "Control_De_Gastos.xlsx")

      mostrarMensaje("Archivo Excel exportado con éxito")
    } catch (error) {
      mostrarMensaje("Error al exportar a Excel", "error")
      console.error("Error en exportación Excel:", error)
    }
  }

  const exportarPDF = async () => {
    try {
      const { jsPDF } = window.jspdf
      const doc = new jsPDF()

      doc.setFontSize(20)
      doc.text("Control de Gastos Personales", 14, 20)

      doc.setFontSize(12)
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30)
      doc.text(`Saldo Total: $${formatearNumero(AppState.saldo)}`, 14, 40)
      doc.text(`Total Ingresos: $${formatearNumero(AppState.ingresos)}`, 14, 50)
      doc.text(`Total Gastos: $${formatearNumero(AppState.gastos)}`, 14, 60)

      const datos = AppState.transacciones.map((t) => [
        formatearFechaHora(t.fecha),
        t.descripcion || "Sin descripción",
        formatearNumero(t.monto),
        capitalizarPrimeraLetra(t.tipo),
        capitalizarPalabras(t.categoria),
      ])

      doc.autoTable({
        head: [["Fecha", "Descripción", "Monto", "Tipo", "Categoría"]],
        body: datos,
        startY: 70,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [0, 0, 0] },
      })

      doc.save("Control_De_Gastos.pdf")
      mostrarMensaje("Archivo PDF exportado con éxito")
    } catch (error) {
      mostrarMensaje("Error al exportar a PDF", "error")
      console.error("Error en exportación PDF:", error)
    }
  }

  const exportarJSON = () => {
    try {
      const datos = {
        transacciones: AppState.transacciones,
        categorias: AppState.categorias,
      }

      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "Control_De_Gastos.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      mostrarMensaje("Datos exportados con éxito")
    } catch (error) {
      mostrarMensaje("Error al exportar los datos", "error")
      console.error("Error en exportación JSON:", error)
    }
  }

  const importarJSON = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return

    try {
      const texto = await archivo.text()
      const datos = JSON.parse(texto)

      if (!datos.transacciones || !datos.categorias) {
        throw new Error("Formato de archivo inválido")
      }

      AppState.transacciones = datos.transacciones
      AppState.categorias = datos.categorias

      if (!AppState.categorias.includes("sin clasificar")) {
        AppState.categorias.unshift("sin clasificar")
      }
      if (!AppState.categorias.includes("otro")) {
        AppState.categorias.push("otro")
      }

      await EstadoManager.guardarCambios()
      mostrarMensaje("Datos importados con éxito")
    } catch (error) {
      mostrarMensaje("Error al importar los datos", "error")
      console.error("Error en importación:", error)
    }
  }

  // Inicialización y event listeners
  document.addEventListener("DOMContentLoaded", () => {
    EstadoManager.inicializar()

    // Event listeners para formularios
    document.getElementById("formulario-transaccion")?.addEventListener("submit", handleSubmitFormulario)

    document.getElementById("categoria")?.addEventListener("change", handleCategoriaChange)

    // Event listeners para exportación
    document.getElementById("exportar-excel")?.addEventListener("click", exportarExcel)

    document.getElementById("exportar-pdf")?.addEventListener("click", exportarPDF)

    document.getElementById("exportar-json")?.addEventListener("click", exportarJSON)

    document.getElementById("importar-json")?.addEventListener("change", importarJSON)

    // Event listener para eliminar transacciones y categorías
    document.addEventListener("click", async (e) => {
      const target = e.target.closest("button")
      if (!target) return

      if (target.classList.contains("boton-eliminar")) {
        const index = Number.parseInt(target.dataset.index)
        if (!isNaN(index)) {
          await eliminarTransaccion(index)
        }
      } else if (target.classList.contains("boton-eliminar-categoria")) {
        const categoria = target.dataset.categoria
        if (categoria) {
          await eliminarCategoria(categoria)
        }
      }
    })
  })

