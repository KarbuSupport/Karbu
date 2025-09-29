"use server"

import { UserService } from "../services/user.service"
import { revalidatePath } from "next/cache"


export async function getUsers() {
  return await UserService.getAllUsers()
}

export async function getUserById(id: number) {
  return await UserService.getUserById(id)
}

export async function createUser(
  firstName: string,
  lastName1: string,
  lastName2: string,
  email: string,
  password: string,
  roleId: number,
) {
  const result = await UserService.createUser(firstName, lastName1, lastName2, email, password, roleId)

  if (result.success) {
    revalidatePath("/users")
  }

  return result
}

export async function updateUser(
  id: number,
  firstName: string,
  lastName1: string,
  lastName2: string,
  email: string,
  roleId: number,
  password?: string,
) {
  const result = await UserService.updateUser(id, firstName, lastName1, lastName2, email, roleId, password)

  if (result.success) {
    revalidatePath("/users")
  }

  return result
}

export async function deleteUser(id: number) {
  const result = await UserService.deleteUser(id)

  if (result.success) {
    revalidatePath("/users")
  }

  return result
}
