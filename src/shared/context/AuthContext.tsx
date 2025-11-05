// context/AuthContext.tsx
"use client"
import React, { createContext, useContext, useState } from "react"

interface AuthContextType {
  permissions: string[]
  setPermissions: (perms: string[]) => void
}

const AuthContext = createContext<AuthContextType>({
  permissions: [],
  setPermissions: () => {},
})

export const AuthProvider = ({ children, permissions: initialPermissions }: { children: React.ReactNode; permissions: string[] }) => {
  const [permissions, setPermissions] = useState<string[]>(initialPermissions)

  return (
    <AuthContext.Provider value={{ permissions, setPermissions }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
