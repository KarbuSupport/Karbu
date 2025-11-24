import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export async function downloadContractPDF(contract: any) {
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
      // FECHA DE FIRMA
      // ====================
      const currentDate = new Date()

      const day = currentDate.getDate()
      const year = currentDate.getFullYear()

      const monthNames = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ]

      const month = monthNames[currentDate.getMonth()]

      currentPage.drawText(String(day), { x: 488, y: 283, size: 6, font: helvetica, color: rgb(0, 0, 0),  })
      currentPage.drawText(String(month), { x: 330, y: 274, size: 6, font: helvetica, color: rgb(0, 0, 0),  })
      currentPage.drawText(String(year), { x: 400, y: 274, size: 6, font: helvetica, color: rgb(0, 0, 0),  })

      // ====================
      // CONSENTIMIENTOS
      // ====================
      if (contract.advertisingConsent) {
        currentPage.drawText("x", { x: 369, y: 169, ...textOptions })
      } else {
        currentPage.drawText("x", { x: 387, y: 169, ...textOptions })
      }

      if (contract.marketingConsent) {
        currentPage.drawText("x", { x: 421, y: 189, ...textOptions })
      } else {
        currentPage.drawText("x", { x: 439, y: 189, ...textOptions })
      }

      // ====================
      // PROFECO
      // ====================
      currentPage.drawText(new Date(contract.startDate).toLocaleDateString("es-ES") || "", { x: 450, y: 123, size: 3.5, font: helvetica, color: rgb(0, 0, 0), });
      currentPage.drawText(contract.profecoNumber || "", { x: 410, y: 123, size: 4, font: helvetica, color: rgb(0, 0, 0), });
      // ====================
      // FIRMA (Imagen)
      // ====================
      if (contract.clientSignature) {
        const pngImageBytes = await fetch(contract.clientSignature).then(res => res.arrayBuffer());
        const pngImage = await mergedPdf.embedPng(pngImageBytes);
        const pngDims = pngImage.scale(0.20); // Ajusta el tamaño según necesites
        currentPage.drawImage(pngImage, {
          x: 380,
          y: 138, // misma posición de la línea
          width: pngDims.width,
          height: pngDims.height,
        });
      }
      currentPage.drawText("_________________________", { x: 360, y: 156, ...textOptions });
    
  // Crear la página en blanco
// const blankPage = mergedPdf.addPage([595, 842]); // tamaño A4
// const { width, height } = blankPage.getSize();
const { width } = currentPage.getSize();

// 📌 Insertar texto
// currentPage.drawText("Aquí puedes escribir lo que quieras en la última página", {
//   x: 50,
//   y: height - 50,
//   size: 12,
//   font: await mergedPdf.embedFont(StandardFonts.Helvetica),
//   color: rgb(0, 0, 0),
// });

// 📌 Insertar QR desde base64
if (contract.qrCode) {
  const qrBase64 = contract.qrCode;

  // Convertir Base64 a ArrayBuffer
  const qrBytes = Uint8Array.from(atob(qrBase64), c => c.charCodeAt(0));

  // Embedir la imagen PNG en el PDF
  const qrImage = await mergedPdf.embedPng(qrBytes);

  const qrDims = qrImage.scale(0.25); // ajustar tamaño

  currentPage.drawImage(qrImage, {
    x: width - qrDims.width - 40,
    y: 50,
    width: qrDims.width,
    height: qrDims.height,
  });
  currentPage.drawText(contract.qrCodeId, {
    x: width - qrDims.width - 33,
    y: 47,
    size: 3.5,
    font: helvetica,
    color: rgb(0, 0, 0)
  })
}

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