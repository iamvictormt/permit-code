"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

interface AuthUser {
  id: string
  email: string
  full_name: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithUser: (userData: AuthUser) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS = [
  { id: "admin-1", email: "admin@empresa.com", password: "admin123", full_name: "Administrador", role: "admin" as const },
  { id: "user-1", email: "usuario@empresa.com", password: "user123", full_name: "Usuário Padrão", role: "user" as const },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = sessionStorage.getItem("auth_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const foundUser = DEMO_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      setUser({
        id: foundUser.id,
        email: foundUser.email,
        full_name: foundUser.full_name,
        role: foundUser.role,
      })
      setIsLoading(false)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: "Email ou senha inválidos" }
  }, [])

  const loginWithUser = useCallback((userData: AuthUser) => {
    setUser(userData)
    sessionStorage.setItem("auth_user", JSON.stringify(userData))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem("auth_user")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
