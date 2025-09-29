import { prisma } from "@/src/lib/prisma"
import { ApiResponse, Permission } from "@/src/lib/types"

export class PermissionService {
  // Get all permissions
  static async getAllPermissions(): Promise<ApiResponse<Permission[]>> {
    try {
      const permissions = await prisma.permission.findMany({
        orderBy: { name: "asc" },
      })

      return {
        success: true,
        data: permissions,
      }
    } catch (error) {
      console.error("Error fetching permissions:", error)
      return {
        success: false,
        error: "Failed to fetch permissions",
      }
    }
  }

  // Create permission
  static async createPermission(name: string): Promise<ApiResponse<Permission>> {
    try {
      const permission = await prisma.permission.create({
        data: { name },
      })

      return {
        success: true,
        data: permission,
      }
    } catch (error) {
      console.error("Error creating permission:", error)
      return {
        success: false,
        error: "Failed to create permission",
      }
    }
  }

  // Update permission
  static async updatePermission(id: number, name: string): Promise<ApiResponse<Permission>> {
    try {
      const permission = await prisma.permission.update({
        where: { id },
        data: { name },
      })

      return {
        success: true,
        data: permission,
      }
    } catch (error) {
      console.error("Error updating permission:", error)
      return {
        success: false,
        error: "Failed to update permission",
      }
    }
  }

  // Delete permission
  static async deletePermission(id: number): Promise<ApiResponse<boolean>> {
    try {
      // Check if permission is assigned to any role
      const rolePermissionsCount = await prisma.rolePermission.count({
        where: { permissionId: id },
      })

      if (rolePermissionsCount > 0) {
        return {
          success: false,
          error: "Cannot delete permission assigned to roles",
        }
      }

      await prisma.permission.delete({
        where: { id },
      })

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error("Error deleting permission:", error)
      return {
        success: false,
        error: "Failed to delete permission",
      }
    }
  }
}