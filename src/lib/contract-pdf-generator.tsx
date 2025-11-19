import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function downloadContractPDF(contract: any) {
console.log('contract :', contract);
  const pdfUrls = [
    "/plantillas/contrato_pagina1.pdf",
    "/plantillas/contrato_pagina2.pdf",
  ];

  const mergedPdf = await PDFDocument.create();

  for (const [i, url] of pdfUrls.entries()) {
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const existingPdf = await PDFDocument.load(existingPdfBytes);

    const [page] = await mergedPdf.copyPages(existingPdf, [0]);
    mergedPdf.addPage(page);

    const helvetica = await mergedPdf.embedFont(StandardFonts.Helvetica);
    const currentPage = mergedPdf.getPage(i);
    const { height } = currentPage.getSize();

    // 📝 Inserta texto con color directamente
    const textOptions = {
      size: 11,
      font: helvetica,
      color: rgb(0, 0, 0),
    };

    if (i === 0) {
      // ====================
      // DATOS DE CLIENTE
      // ====================
      currentPage.drawText(contract.clientName || "", { x: 170, y: height - 173, ...textOptions });
      currentPage.drawText(contract.domicilio || "", { x: 150, y: height - 240, ...textOptions });
      currentPage.drawText(contract.clientRFC || "", { x: 135, y: height - 795, ...textOptions });
      // ====================
      // DOMICILIO
      // ====================
      currentPage.drawText(contract.clientStreet || "", { x: 390, y: height - 715, ...textOptions });
      currentPage.drawText(contract.clientExteriorNumber || "", { x: 150, y: height - 733, ...textOptions });
      currentPage.drawText(contract.clientInteriorNumber || "", { x: 290, y: height - 733, ...textOptions });
      currentPage.drawText(contract.clientNeighborhood || "", { x: 370, y: height - 733, ...textOptions });
      currentPage.drawText(contract.clientPostalCode || "", { x: 105, y: height - 748, ...textOptions });
      currentPage.drawText(contract.clientCity || "", { x: 200, y: height - 748, ...textOptions });
      // ====================
      // VEHICLE
      // ====================
      currentPage.drawText(contract.vehicle.brand || "", { x: 450, y: height - 810, ...textOptions }); // Marca
      currentPage.drawText(contract.vehicle.year.toString() || "", { x: 320, y: height - 825, ...textOptions }); // Modelo
      currentPage.drawText(contract.vehicle.model || "", { x: 185, y: height - 825, ...textOptions }); // Submarca
      currentPage.drawText(contract.vehicle.engineType || "", { x: 403, y: height - 825, ...textOptions }); // Tipo
      currentPage.drawText(contract.vehicle.engineNumber || "", { x: 153, y: height - 840, ...textOptions }); // Número de motor
      currentPage.drawText(contract.vehicle.vin || "", { x: 308, y: height - 840, ...textOptions }); // Número de serie (NIV - VIN)
      // ====================
      // EMAIL
      // ====================
      currentPage.drawText("ventas@karbu.com.mx", { x: 155, y: height - 575, size: 10, font: helvetica, color: rgb(0, 0, 0), });
    }

    if (i === 1) {
      // ====================
      // CONSENTIMIENTOS
      // ====================

      // ====================
      // PROFECO
      // ====================
      currentPage.drawText(new Date(contract.startDate).toLocaleDateString("es-ES") || "", { x: 450, y: 123, size: 3, font: helvetica, color: rgb(0, 0, 0), });
      currentPage.drawText(contract.profecoNumber || "", { x: 410, y: 123, size: 4, font: helvetica, color: rgb(0, 0, 0), });
      // ====================
      // FIRMA
      // ====================
      currentPage.drawText("_________________________", { x: 360, y: 156, ...textOptions });
      // currentPage.drawText("Firma del Consumidor", { x: 315, y: 120, ...textOptions });
    }
  }

  // ✅ Convertir Uint8Array a ArrayBuffer limpio (evita SharedArrayBuffer)
  const pdfBytes = await mergedPdf.save();
  const arrayBuffer = new ArrayBuffer(pdfBytes.length);
  const view = new Uint8Array(arrayBuffer);
  view.set(pdfBytes);

  // 📥 Crear blob y descargar
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `POLIZA_${contract.consumidor || "cliente"}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}