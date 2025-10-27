"use client"

import jsPDF from "jspdf"

interface ContractData {
  id: number
  clientName: string
  startDate: Date
  endDate?: Date
  qrCode?: string
  vehicle?: {
    brand: string
    model: string
    year: number
    licensePlate?: string
  }
  services?: Array<{
    service: {
      name: string
    }
    price: number
  }>
  responsible?: {
    firstName: string
    lastName1: string
    email: string
  }
}

export function generateContractPDF(contract: ContractData) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPosition = 20

  // Header
  doc.setFontSize(20)
  doc.text("CONTRATO DE SERVICIOS", pageWidth / 2, yPosition, { align: "center" })
  yPosition += 15

  // Contract number and date
  doc.setFontSize(10)
  doc.text(`Contrato #: CNT-${contract.id}`, 20, yPosition)
  doc.text(`Fecha: ${new Date(contract.startDate).toLocaleDateString("es-ES")}`, pageWidth - 60, yPosition)
  yPosition += 10

  // Separator line
  doc.setDrawColor(0)
  doc.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 10

  // Client information
  doc.setFontSize(12)
  doc.text("INFORMACIÓN DEL CLIENTE", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.text(`Nombre: ${contract.clientName}`, 25, yPosition)
  yPosition += 6
  doc.text(`Responsable: ${contract.responsible?.firstName} ${contract.responsible?.lastName1}`, 25, yPosition)
  yPosition += 6
  doc.text(`Email: ${contract.responsible?.email}`, 25, yPosition)
  yPosition += 12

  // Vehicle information
  doc.setFontSize(12)
  doc.text("INFORMACIÓN DEL VEHÍCULO", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.text(`Marca: ${contract.vehicle?.brand}`, 25, yPosition)
  yPosition += 6
  doc.text(`Modelo: ${contract.vehicle?.model}`, 25, yPosition)
  yPosition += 6
  doc.text(`Año: ${contract.vehicle?.year}`, 25, yPosition)
  yPosition += 6
  doc.text(`Placa: ${contract.vehicle?.licensePlate || "N/A"}`, 25, yPosition)
  yPosition += 12

  // Services
  doc.setFontSize(12)
  doc.text("SERVICIOS CONTRATADOS", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  let totalPrice = 0
  contract.services?.forEach((service, index) => {
    const price = typeof service.price === "number" ? service.price : Number(service.price)
    totalPrice += price
    doc.text(`${index + 1}. ${service.service.name}: $${price.toLocaleString()}`, 25, yPosition)
    yPosition += 6
  })

  yPosition += 4
  doc.setFontSize(11)
  doc.text(`TOTAL: $${totalPrice.toLocaleString()}`, 25, yPosition)
  yPosition += 12

  // Dates
  doc.setFontSize(12)
  doc.text("VIGENCIA DEL CONTRATO", 20, yPosition)
  yPosition += 8

  doc.setFontSize(10)
  doc.text(`Fecha Inicio: ${new Date(contract.startDate).toLocaleDateString("es-ES")}`, 25, yPosition)
  yPosition += 6
  doc.text(
    `Fecha Fin: ${contract.endDate ? new Date(contract.endDate).toLocaleDateString("es-ES") : "Indefinida"}`,
    25,
    yPosition,
  )
  yPosition += 12

  // QR Code
  if (contract.qrCode) {
    doc.setFontSize(10)
    doc.text(`Código QR: ${contract.qrCode}`, 25, yPosition)
  }

  // Footer
  doc.setFontSize(8)
  doc.text("Este documento es un contrato oficial. Conserve una copia para sus registros.", 20, pageHeight - 20, {
    align: "left",
  })

  return doc
}

export function downloadContractPDF(contract: ContractData) {
  const doc = generateContractPDF(contract)
  doc.save(`Contrato-${contract.id}.pdf`)
}
