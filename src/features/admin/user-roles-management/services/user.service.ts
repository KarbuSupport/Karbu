import { prisma } from "@/src/lib/prisma"
import { ApiResponse, UserWithRole } from "@/src/lib/types"
import bcrypt from "bcryptjs"

export class UserService {
  // Get all users with their roles
  static async getAllUsers(): Promise<ApiResponse<UserWithRole[]>> {
    try {
      const users = await prisma.user.findMany({
        include: {
          role: true,
        },
        orderBy: { createdAt: "asc" },
      })

      return {
        success: true,
        data: users,
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      return {
        success: false,
        error: "Failed to fetch users",
      }
    }
  }

  // Get user by ID
  static async getUserById(id: number): Promise<ApiResponse<UserWithRole>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
        },
      })

      if (!user) {
        return {
          success: false,
          error: "User not found",
        }
      }

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      console.error("Error fetching user:", error)
      return {
        success: false,
        error: "Failed to fetch user",
      }
    }
  }

  // Create new user
  static async createUser(
    firstName: string,
    lastName1: string,
    lastName2: string,
    email: string,
    password: string,
    roleId: number,
  ): Promise<ApiResponse<UserWithRole>> {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return {
          success: false,
          error: "Email already exists",
        }
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12)

      const user = await prisma.user.create({
        data: {
          firstName,
          lastName1,
          lastName2,
          email,
          passwordHash,
          roleId,
        },
        include: {
          role: true,
        },
      })

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      return {
        success: false,
        error: "Failed to create user",
      }
    }
  }

  // Update user
  static async updateUser(
    id: number,
    firstName: string,
    lastName1: string,
    lastName2: string,
    email: string,
    roleId: number,
    password?: string,
  ): Promise<ApiResponse<UserWithRole>> {
    try {
      // Check if email is taken by another user
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id },
        },
      })

      if (existingUser) {
        return {
          success: false,
          error: "Email already exists",
        }
      }

      const updateData: any = {
        firstName,
        lastName1,
        lastName2,
        email,
        roleId,
      }

      // Hash new password if provided
      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 12)
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          role: true,
        },
      })

      return {
        success: true,
        data: user,
      }
    } catch (error) {
      console.error("Error updating user:", error)
      return {
        success: false,
        error: "Failed to update user",
      }
    }
  }

  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse<boolean>> {
    try {
      await prisma.user.delete({
        where: { id },
      })

      return {
        success: true,
        data: true,
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      return {
        success: false,
        error: "Failed to delete user",
      }
    }
  }
}