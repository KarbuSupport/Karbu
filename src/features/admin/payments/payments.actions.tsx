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
  type CreatePaymentInput,
  type UpdatePaymentInput,
  type PaymentFilters,
} from "@/src/features/admin/payments/payments.service"

// CREATE
export async function createPaymentAction(data: CreatePaymentInput) {
  return await createPayment(data)
}

// READ - All payments
export async function getPaymentsAction(filters?: PaymentFilters) {
  return await getPayments(filters)
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
