// app/admin/layout.tsx
import { cookies } from "next/headers"
import { decode } from "jsonwebtoken"
import { AuthProvider } from "@/src/shared/context/AuthContext"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("auth_token")?.value

  let userId: number | null = null
  let permissions: string[] = []
  let email: string | null = null
  let name: string | null = null

  if (token) {
    try {
      const decoded = decode(token) as {
        permissions?: string[]
        sub?: number
        email?: string
        name?: string
      }

      userId = decoded?.sub ?? null
      permissions = decoded?.permissions ?? []
      email = decoded?.email ?? null
      name = decoded?.name ?? null

    } catch (e) {
      console.error("Error decoding token:", e)
    }
  }

  return (
    <AuthProvider
      userId={userId}
      permissions={permissions}
      email={email}
      name={name}
    >
      {children}
    </AuthProvider>
  )
}
