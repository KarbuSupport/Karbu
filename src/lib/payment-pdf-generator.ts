import jsPDF from "jspdf"

export function generatePaymentPDF(payment: any) {
console.log('payment :', payment);
  const doc = new jsPDF({ unit: "mm", format: "a4" })

  // 🎨 Paleta corporativa
  const karbuRed: [number, number, number] = [222, 31, 38]
  const darkGray: [number, number, number] = [45, 45, 45]
  const lightGray: [number, number, number] = [245, 246, 247]
  const dividerGray: [number, number, number] = [200, 200, 200]

  const PAGE_HEIGHT = 297
  const MARGIN = 20
  const BOTTOM_LIMIT = 270
  let y = 25

  // 🟥 HEADER
  const drawHeader = () => {
    doc.setFillColor(...karbuRed)
    doc.rect(0, 0, 210, 40, "F")

    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text("RECIBO DE PAGO", 105, 20, { align: "center" })

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text(`ID: PAY-${payment.id}`, 105, 30, { align: "center" })
    doc.text(`Fecha: ${new Date(payment.paymentDate).toLocaleString("es-MX")}`, 105, 36, {
      align: "center",
    })

    doc.setDrawColor(...dividerGray)
    doc.setLineWidth(0.5)
    doc.line(0, 40, 210, 40)

    y = 55
  }

  // ⬇️ FOOTER
  const drawFooter = (page: number, total: number) => {
    doc.setFontSize(8)
    doc.setTextColor(130, 130, 130)
    doc.text("© Karbu | Tu mecánico de confianza", 105, 285, { align: "center" })
    doc.text("Recibo generado automáticamente", 105, 290, { align: "center" })
    doc.text(`Página ${page} de ${total}`, 200, 290, { align: "right" })
  }

  // 📄 Control automático de salto
  const checkPage = (extra = 20) => {
    if (y + extra > BOTTOM_LIMIT) {
      doc.addPage()
      drawHeader()
    }
  }

  // 🏷️ Sección
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

  // 🧩 Bloques gris
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

  // 🔽 INICIO DOCUMENTO
  drawHeader()

  // ============================================================
  //                     📌 INFORMACIÓN DEL PAGO
  // ============================================================

  sectionTitle("Datos del Pago")
  addDataBlock([
    [`Monto: $${Number(payment.amount).toFixed(2)} MXN`, ``],
    [`Método de Pago: ${payment.method}`, ``],
    [`Referencia: ${payment.voucherNumber || "N/A"}`, ``],
    [
      `Aplicado a: ${
        payment.contractId
          ? `Contrato #${payment.contractId}`
          : `Cotización #${payment.quoteId}`
      }`,
      ``,
    ],
  ])

  // ============================================================
  //                     👤 RESPONSABLE
  // ============================================================

  const responsibleName = payment.responsible
    ? `${payment.responsible.firstName} ${payment.responsible.lastName1}`
    : "N/A"

  sectionTitle("Responsable")
  addDataBlock([[`Recibió: ${responsibleName}`, ``]])

  // ============================================================
  //                     📝 Notas
  // ============================================================

  if (payment.notes) {
    sectionTitle("Notas del Pago")
    const lines = doc.splitTextToSize(payment.notes, 170)
    checkPage(lines.length * 4 + 10)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(...darkGray)
    doc.text(lines, MARGIN, y)
    y += lines.length * 4 + 8
  }

  // ============================================================
  //                     🖼️ VOUCHER
  // ============================================================

  if (payment.voucherImage) {
    sectionTitle("Comprobante / Voucher")

    checkPage(80)

    try {
      doc.addImage(payment.voucherImage, "PNG", MARGIN, y, 170, 80)
      y += 90
    } catch (err) {
      addDataBlock([["Error mostrando voucher (formato inválido)", ""]])
    }
  }

  // ============================================================
  //                    🧾 FOOTER EN TODAS LAS PÁGINAS
  // ============================================================

  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    drawFooter(i, totalPages)
  }

  doc.save(`pago_PAY-${payment.id}.pdf`)
}
