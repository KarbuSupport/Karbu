import jsPDF from "jspdf"
import type { QuoteFormData } from "@/src/shared/types/quote"

export function generateQuotePDF(formData: QuoteFormData, quoteId: string) {
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  // 🎨 Paleta corporativa Karbu
  const karbuRed: [number, number, number] = [222, 31, 38]
  const darkGray: [number, number, number] = [45, 45, 45]
  const lightGray: [number, number, number] = [245, 246, 247]
  const dividerGray: [number, number, number] = [200, 200, 200]

  const PAGE_HEIGHT = 297
  const MARGIN = 20
  const BOTTOM_LIMIT = 270
  let y = 25

  // 🟥 Encabezado corporativo
  const drawHeader = () => {
    doc.setFillColor(...karbuRed)
    doc.rect(0, 0, 210, 40, "F")

    // Título
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text("COTIZACIÓN DE INSPECCIÓN", 105, 20, { align: "center" })

    // Datos secundarios
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text(`ID: ${quoteId}`, 105, 30, { align: "center" })
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-MX")}`, 105, 36, { align: "center" })

    // Línea decorativa inferior
    doc.setDrawColor(...dividerGray)
    doc.setLineWidth(0.5)
    doc.line(0, 40, 210, 40)

    y = 55
  }

  // ⚙️ Footer elegante
  const drawFooter = (page: number, total: number) => {
    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)
    doc.text("© Karbu | Tu mecánico de confianza", 105, 285, { align: "center" })
    doc.text("Documento de cotización preliminar sujeto a cambios", 105, 290, { align: "center" })
    doc.text(`Página ${page} de ${total}`, 200, 290, { align: "right" })
  }

  // 📄 Control automático de salto de página
  const checkPage = (extra = 20) => {
    if (y + extra > BOTTOM_LIMIT) {
      doc.addPage()
      drawHeader()
    }
  }

  // 🏷️ Encabezado de sección tipo “etiqueta”
  const sectionTitle = (title: string) => {
    checkPage(15)
    doc.setFillColor(...karbuRed)
    doc.rect(MARGIN - 5, y - 2, 200 - MARGIN * 0.9, 9, "F")
    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(255, 255, 255)
    doc.text(title.toUpperCase(), MARGIN, y + 4)
    y += 12
  }

  // 🧩 Bloques de datos con fondo gris
  const addDataBlock = (rows: string[][]) => {
    checkPage(rows.length * 6 + 10)
    doc.setFillColor(...lightGray)
    doc.rect(MARGIN - 5, y - 3, 180, rows.length * 6 + 6, "F")

    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...darkGray)
    let lineY = y + 3
    rows.forEach((row) => {
      doc.text(row[0], MARGIN, lineY)
      if (row[1]) doc.text(row[1], 110, lineY)
      lineY += 6
    })
    y = lineY + 3
  }

  // 📌 Iniciar documento
  drawHeader()

  // 🚗 Secciones principales
  sectionTitle("Datos del vehículo")
  addDataBlock([
    [`Marca: ${formData.vehicle.brand}`, `Modelo: ${formData.vehicle.model}`],
    [`Año: ${formData.vehicle.year}`, `Placas: ${formData.vehicle.licensePlate || "N/A"}`],
    [`Motor: ${formData.vehicle.engineType}`, `Transmisión: ${formData.vehicle.transmission}`],
  ])

  sectionTitle("Niveles de fluidos")
  addDataBlock([
    [`Aceite: ${formData.vehicleCheck?.oilLevel || "N/A"}`, `Temperatura: ${formData.vehicleCheck?.temperatureLevel || "N/A"}`],
    [`Gasolina: ${formData.vehicleCheck?.fuelLevel || "N/A"}`, `Aceite Motor: ${formData.vehicleCheck?.engineOil || "N/A"}`],
    [`Aceite Transmisión: ${formData.vehicleCheck?.transmissionOil || "N/A"}`, `Líquido Frenos: ${formData.vehicleCheck?.brakeFluid || "N/A"}`],
  ])

  sectionTitle("Batería")
  addDataBlock([
    [`Tipo: ${formData.vehicleCheck?.batteryType || "N/A"}`, `Marca: ${formData.vehicleCheck?.batteryBrand || "N/A"}`],
    [`Estado: ${formData.vehicleCheck?.batteryStatus || "N/A"}`, ``],
  ])

  sectionTitle("Daños externos")
  addDataBlock([
    [`Rayones: ${formData.vehicleCheck?.scratches || "N/A"}`, `Abolladuras: ${formData.vehicleCheck?.dents || "N/A"}`],
    [`Colisiones: ${formData.vehicleCheck?.collisions || "N/A"}`, ``],
  ])

  sectionTitle("Llantas y frenos")
  addDataBlock([
    [`Llantas Delanteras: ${formData.vehicleCheck?.frontTires || "N/A"}`, `Frenos Delanteros: ${formData.vehicleCheck?.frontBrakes || "N/A"}`],
    [`Llantas Traseras: ${formData.vehicleCheck?.rearTires || "N/A"}`, `Frenos Traseros: ${formData.vehicleCheck?.rearBrakes || "N/A"}`],
  ])

  sectionTitle("Sistemas")
  addDataBlock([
    [`Inspección Fugas: ${formData.vehicleCheck?.leakInspection || "N/A"}`, `Sistema Frenos: ${formData.vehicleCheck?.brakeSystem || "N/A"}`],
    [`Sistema Motor: ${formData.vehicleCheck?.engineSystem || "N/A"}`, `Enfriamiento Motor: ${formData.vehicleCheck?.engineCoolingSystem || "N/A"}`],
    [`Enfriamiento Transmisión: ${formData.vehicleCheck?.transmissionCoolingSystem || "N/A"}`, ``],
  ])

  sectionTitle("Componentes mecánicos")
  addDataBlock([
    [`Amortiguadores: ${formData.vehicleCheck?.shockAbsorbers || "N/A"}`, `Bandas: ${formData.vehicleCheck?.belts || "N/A"}`],
    [`Mangueras: ${formData.vehicleCheck?.hoses || "N/A"}`, `Filtro Aire: ${formData.vehicleCheck?.airFilter || "N/A"}`],
    [`Dirección: ${formData.vehicleCheck?.steeringMechanism || "N/A"}`, `Bujes Suspensión: ${formData.vehicleCheck?.suspensionBushings || "N/A"}`],
    [`Sistema Escape: ${formData.vehicleCheck?.exhaustSystem || "N/A"}`, `Baleros: ${formData.vehicleCheck?.bearings || "N/A"}`],
  ])

  // 🧰 Servicios
  sectionTitle("Servicios requeridos")
  const services = [
    { key: "basicMaintenance", label: "Mantenimiento Básico (aceite, filtros, bujías)" },
    { key: "preventiveMaintenance", label: "Mantenimiento Preventivo (limpiezas y ajustes)" },
    { key: "electronicDiagnostics", label: "Diagnóstico y Escaneo Electrónico" },

    { key: "fuelSystemService", label: "Servicio al Sistema de Combustible (inyectores, MAF, \n cuerpo de aceleración)" },
    { key: "coolingSystemService", label: "Servicio al Sistema de Enfriamiento" },
    { key: "brakeService", label: "Servicio de Frenos" },
    { key: "suspensionAndSteering", label: "Suspensión y Dirección" },

    { key: "generalMechanics", label: "Mecánica General (motor, transmisión, fugas)" },
    { key: "electricalSystem", label: "Sistema Eléctrico" },

    { key: "generalInspection", label: "Inspección General del Vehículo" },
    { key: "tripInspection", label: "Revisión Previaje / Precompra" },

    { key: "emissionsPreparation", label: "Preparación para Verificación" },
    { key: "accessoriesInstallation", label: "Instalación de Accesorios" },

    { key: "repairInsurance", label: "Seguro de Reparación" }
  ];

  const selected = services.filter((s) => formData.vehicleService?.[s.key as keyof typeof formData.vehicleService])
const serviceRows: string[][] = []

for (let i = 0; i < selected.length; i += 2) {
  const firstLines = (selected[i]?.label || "").split("\n")
  const secondLines = (selected[i + 1]?.label || "").split("\n")

  // Encontrar el mayor número de líneas para emparejar columnas
  const maxLines = Math.max(firstLines.length, secondLines.length)

  for (let j = 0; j < maxLines; j++) {
    serviceRows.push([
      firstLines[j] ? `- ${firstLines[j]}` : "",
      secondLines[j] ? `- ${secondLines[j]}` : "",
    ])
  }
}

// Luego lo pasas a tu función que genera el PDF
addDataBlock(serviceRows.length ? serviceRows : [["No se seleccionaron servicios", ""]])

  // 💰 Presupuesto y observaciones
  sectionTitle("Presupuesto y observaciones")
  addDataBlock([
    [`Presupuesto: $${formData.repairEstimate?.toFixed(2) || "0.00"} MXN`, ``],
    [`Chequeo Compra-Venta: ${formData.purchaseCheck ? "Sí" : "No"}`, `Inspección Visual Completa: ${formData.fullVisualInspection ? "Sí" : "No"}`],
  ])

  const addParagraph = (title: string, text?: string) => {
    if (!text) return
    sectionTitle(title)
    const lines = doc.splitTextToSize(text, 170)
    checkPage(lines.length * 4 + 10)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...darkGray)
    doc.text(lines, MARGIN, y)
    y += lines.length * 4 + 8
  }

  addParagraph("Notas Generales", formData.generalNotes)
  addParagraph("Revisión de Chasis", formData.chassisReview)
  addParagraph("Daños Visibles", formData.visibleDamages)

  // 🧾 Footer en todas las páginas
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    drawFooter(i, totalPages)
  }

  const fileName = `cotizacion_${formData.vehicle.brand}_${formData.vehicle.model}_${Date.now()}.pdf`
  doc.save(fileName)
}
