"use server"

import { PermissionService } from "../services/permission.service"
import { revalidatePath } from "next/cache"

export async function getPermissions() {
  return await PermissionService.getAllPermissions()
}

export async function createPermission(name: string) {
  const result = await PermissionService.createPermission(name)

  if (result.success) {
    revalidatePath("/permissions")
  }

  return result
}

export async function updatePermission(id: number, name: string) {
  const result = await PermissionService.updatePermission(id, name)

  if (result.success) {
    revalidatePath("/permissions")
  }

  return result
}

export async function deletePermission(id: number) {
  const result = await PermissionService.deletePermission(id)

  if (result.success) {
    revalidatePath("/permissions")
  }

  return result
}