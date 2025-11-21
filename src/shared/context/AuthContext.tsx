"use client"

import { createContext, useContext } from "react"

interface AuthContextType {
  userId: number | null
  permissions: string[]
  email: string | null
  name: string | null
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  permissions: [],
  email: null,
  name: null,
})

export function AuthProvider({
  children,
  userId,
  permissions,
  email,
  name,
}: {
  children: React.ReactNode
  userId: number | null
  permissions: string[]
  email: string | null
  name: string | null
}) {
  return (
    <AuthContext.Provider value={{ userId, permissions, email, name }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
