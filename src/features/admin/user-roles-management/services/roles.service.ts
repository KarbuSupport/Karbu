import { prisma } from "@/src/lib/prisma"
import { ApiResponse, RoleWithPermissions } from "@/src/lib/types"

export class RoleService {
  // Get all roles with their permissions
  static async getAllRoles(): Promise<ApiResponse<RoleWithPermissions[]>> {
    try {
      const roles = await prisma.role.findMany({
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return {
        success: true,
        data: roles,
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      return {
        success: false,
        error: "Failed to fetch roles",
      }
    }
  }

  // Get role by ID
  static async getRoleById(id: number): Promise<ApiResponse<RoleWithPermissions>> {
    try {
      const role = await prisma.role.findUnique({
        where: { id },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      if (!role) {
        return {
          success: false,
          error: "Role not found",
        }
      }

      return {
        success: true,
        data: role,
      }
    } catch (error) {
      console.error("Error fetching role:", error)
      return {
        success: false,
        error: "Failed to fetch role",
      }
    }
  }

  // Create new role
  static async createRole(
    name: string,
    description: string | null,
    permissionIds: number[],
  ): Promise<ApiResponse<RoleWithPermissions>> {
    try {
      const role = await prisma.role.create({
        data: {
          name,
          description,
          permissions: {
            create: permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return {
        success: true,
        data: role,
      }
    } catch (error) {
      console.error("Error creating role:", error)
      return {
        success: false,
        error: "Failed to create role",
      }
    }
  }

  // Update role
  static async updateRole(
    id: number,
    name: string,
    description: string | null,
    permissionIds: number[],
  ): Promise<ApiResponse<RoleWithPermissions>> {
    try {
      // Delete existing permissions and create new ones
      await prisma.rolePermission.deleteMany({
        where: { roleId: id },
      })

      const role = await prisma.role.update({
        where: { id },
        data: {
          name,
          description,
          permissions: {
            create: permissionIds.map((permissionId) => ({
              permissionId,
            })),
          },
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })

      return {
        success: true,
        data: role,
      }
    } catch (error) {
      console.error("Error updating role:", error)
      return {
        success: false,
        error: "Failed to update role",
      }
    }
  }

  // Delete role
  static async deleteRole(id: number): Promise<ApiResponse<boolean>> {
    try {
      // Check if role has users assigned
      const usersCount = await prisma.user.count({
        where: { roleId: id },
      })

      if (usersCount > 0) {
        return {
          success: false,
          error: "Cannot delete role with assigned users",
        }
      }

      // Delete role permissions first
      await prisma.rolePermission.deleteMany({
        where: { roleId: id },
      })

      // Delete role
      await prisma.role.delete({
        where: { id },
      })

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error("Error deleting role:", error)
      return {
        success: false,
        error: "Failed to delete role",
      }
    }
  }
}
