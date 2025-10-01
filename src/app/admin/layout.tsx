// app/admin/layout.tsx
import { cookies } from "next/headers"
import { decode } from "jsonwebtoken"
import { AuthProvider } from "@/src/shared/context/AuthContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("auth_token")?.value
  let permissions: string[] = []

  if (token) {
    try {
      const decoded = decode(token) as { permissions?: string[] }
      permissions = decoded?.permissions || []
    } catch (e) {
      console.error("Error decoding token:", e)
    }
  }

  return (
    <AuthProvider permissions={permissions}>
      {children}
    </AuthProvider>
  )
}
