// Database types based on Prisma schema
export interface User {
  id: number
  firstName: string | null
  lastName1: string | null
  lastName2: string | null
  email: string | null
  passwordHash: string | null
  roleId: number | null
  createdAt: Date | null
  updatedAt: Date | null
  role?: Role | null
}

export interface Role {
  id: number | null
  name: string | null
  description?: string | null
  users?: (User | null)[] | null
  permissions?: (RolePermission | null)[] | null
}

export interface Permission {
  id: number | null
  name: string | null
  roles?: (RolePermission | null)[] | null
}

export interface RolePermission {
  id: number | null
  roleId: number | null
  permissionId: number | null
  role?: Role | null
  permission?: Permission | null
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T | null
  error?: string | null
}

export interface RoleWithPermissions {
  id: number | null
  name: string | null
  description?: string | null
  permissions: Array<{
    permission: Permission | null
  }> | null
}

export interface UserWithRole extends User {
  role: Role | null
}
