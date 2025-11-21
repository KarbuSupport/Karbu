"use server"

import {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
  getPaymentsByContract,
  getTotalPaidByContract,
  getContractsAvailableForPayment,
  getQuotesAvailableForPayment,
  type CreatePaymentInput,
  type UpdatePaymentInput,
  type PaymentFilters,
  getPaymentsStats,
} from "@/src/features/admin/payments/payments.service"

// CREATE
export async function createPaymentAction(data: CreatePaymentInput) {
  return await createPayment(data)
}

// READ - All payments
export async function getPaymentsAction(filters?: PaymentFilters) {
  try {
    const payments = await getPayments(filters)
    return payments
  } catch (error) {
    console.error("Server action error:", error)
    return []
  }
}

// READ - Single payment
export async function getPaymentByIdAction(id: number) {
  return await getPaymentById(id)
}

// UPDATE
export async function updatePaymentAction(data: UpdatePaymentInput) {
  return await updatePayment(data)
}

// DELETE
export async function deletePaymentAction(id: number) {
  return await deletePayment(id)
}

// Get payments by contract
export async function getPaymentsByContractAction(contractId: number) {
  return await getPaymentsByContract(contractId)
}

// Get total paid by contract
export async function getTotalPaidByContractAction(contractId: number) {
  return await getTotalPaidByContract(contractId)
}

// Get contracts available for payment
export async function getContractsAvailableForPaymentAction() {
  return await getContractsAvailableForPayment()
}

export async function getQuotesAvailableForPaymentAction() {
  return await getQuotesAvailableForPayment()
}

export async function getPaymentsStatsAction() {
  const {data} = await getPaymentsStats()
  return data;
}
