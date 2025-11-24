"use client"

import { createContext, useContext, useState } from "react"

interface AuthContextType {
  userId: number | null
  permissions: string[]
  email: string | null
  name: string | null

  // setters
  setUserId: (id: number | null) => void
  setPermissions: (p: string[]) => void
  setEmail: (email: string | null) => void
  setName: (name: string | null) => void
}

const AuthContext = createContext<AuthContextType>({
  userId: null,
  permissions: [],
  email: null,
  name: null,

  setUserId: () => {},
  setPermissions: () => {},
  setEmail: () => {},
  setName: () => {},
})

export function AuthProvider({
  children,
  userId: initialUserId,
  permissions: initialPermissions,
  email: initialEmail,
  name: initialName,
}: {
  children: React.ReactNode
  userId: number | null
  permissions: string[]
  email: string | null
  name: string | null
}) {
  const [userId, setUserId] = useState(initialUserId)
  const [permissions, setPermissions] = useState(initialPermissions)
  const [email, setEmail] = useState(initialEmail)
  const [name, setName] = useState(initialName)

  return (
    <AuthContext.Provider
      value={{
        userId,
        permissions,
        email,
        name,
        setUserId,
        setPermissions,
        setEmail,
        setName,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
