"use server"

import { ContractService } from "@/src/features/admin/contracts/contract.service"

export async function getContractsAction(filters?: {
  status?: string
  search?: string
  skip?: number
  take?: number
}) {
  try {
    const contracts = await ContractService.getContracts(filters)
    return { success: true, data: contracts }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error fetching contracts" }
  }
}

export async function getContractByIdAction(id: number) {
  try {
    const contract = await ContractService.getContractById(id)
    return { success: true, data: contract }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error fetching contract" }
  }
}

export async function createContractAction(data: {
  clientName: string
  vehicleId: number
  quoteId?: number
  startDate: Date
  endDate?: Date
  status: string
  responsibleUser: number
  services: Array<{ serviceId: number; price: number }>
}) {
  try {
    const contract = await ContractService.createContract(data)
    return { success: true, data: contract }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error creating contract" }
  }
}

export async function updateContractAction(
  id: number,
  data: {
    clientName?: string
    vehicleId?: number
    quoteId?: number
    startDate?: Date
    endDate?: Date
    status?: string
    services?: Array<{ serviceId: number; price: number }>
  },
) {
  try {
    const contract = await ContractService.updateContract(id, data)
    return { success: true, data: contract }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error updating contract" }
  }
}

export async function deleteContractAction(id: number) {
  try {
    await ContractService.deleteContract(id)
    return { success: true }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error deleting contract" }
  }
}

export async function getContractStatsAction() {
  try {
    const stats = await ContractService.getContractStats()
    return { success: true, data: stats }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error fetching stats" }
  }
}

export async function getVehiclesAction() {
  try {
    const vehicles = await ContractService.getVehicles()
    return { success: true, data: vehicles }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error fetching vehicles" }
  }
}

export async function getServicesAction() {
  try {
    const services = await ContractService.getServices()
    return { success: true, data: services }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "Error fetching services" }
  }
}
