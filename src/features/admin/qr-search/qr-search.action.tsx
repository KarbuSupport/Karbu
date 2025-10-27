"use server"

import { searchContractByQR, getAllContracts } from "@/src/features/admin/qr-search/qr-search.service"

export async function searchContractAction(qrCode: string) {
  return await searchContractByQR(qrCode)
}

export async function getContractsAction() {
  return await getAllContracts()
}
