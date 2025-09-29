"use server"

import { revalidatePath } from "next/cache"
import { RoleService } from "../services/roles.service"

export async function getRoles() {
    return await RoleService.getAllRoles()
}

export async function getRoleById(id: number) {
    return await RoleService.getRoleById(id)
}

export async function createRole(name: string, description: string | null, permissionIds: number[]) {
    const result = await RoleService.createRole(name, description, permissionIds)
    
    if (result.success) {
        revalidatePath("/roles")
    }
    
    return result
}

export async function updateRole(id: number, name: string, description: string | null, permissionIds: number[]) {
    const result = await RoleService.updateRole(id, name, description, permissionIds)
    
    if (result.success) {
        revalidatePath("/roles")
    }
    
    return result
}

export async function deleteRole(id: number) {
    const result = await RoleService.deleteRole(id)
    
    if (result.success) {
        revalidatePath("/roles")
    }
    
    return result
}