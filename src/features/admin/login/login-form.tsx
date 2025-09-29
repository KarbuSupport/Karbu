"use client"

import { useState } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/card"
import { Eye, EyeOff, User, Lock } from "lucide-react"
import { loginAction } from "./login.actions"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await loginAction(undefined, formData)
    console.log("result.message",result);

    if (result.success) {
      router.push("/admin/dashboard")
    } else {
      setError(result.message ?? "Error al iniciar sesión")
      console.log("result.message",result.message);
    }
  }

  return (
    
    <div className="space-y-8">
      {/* Logo y marca Karbu */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">KARBU</h1>
            <p className="text-sm text-muted-foreground font-medium">
              TU MECÁNICO DE CONFIANZA
            </p>
          </div>
        </div>
        <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
      </div>

      {/* Formulario de login */}
      <Card className="border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Iniciar Sesión</CardTitle>
          <CardDescription className="text-muted-foreground">
            Accede al sistema de gestión del taller
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@karbu.com.mx"
                  className="pl-10 h-12 border-border focus:ring-primary focus:border-primary"
                  value={email}                      // <-- Vinculado a estado
                  onChange={(e) => setEmail(e.target.value)}  // <-- Actualiza estado
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10 h-12 border-border focus:ring-primary focus:border-primary"
                  value={password}                  // <-- Vinculado a estado
                  onChange={(e) => setPassword(e.target.value)} // <-- Actualiza estado
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Mostrar error si existe */}
            {error && (
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 hover:cursor-pointer text-primary-foreground font-semibold text-base transition-colors"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Sistema de Gestión Karbu v1.0</p>
              <p className="text-xs text-muted-foreground">© 2025 Karbu - Todos los derechos reservados</p>
              <p className="text-xs text-muted-foreground/70 mt-3">
                Desarrollado por{" "}
                <a
                  href="https://jossefsosa.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-medium transition-colors underline decoration-dotted"
                >
                  Jossef Sosa
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">¿Necesitas ayuda? Contacta al administrador</p>
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <span>📞 Soporte: (555) 123-4567</span>
          <span>•</span>
          <span>📧 admin@karbu.com.mx</span>
        </div>
      </div>
    </div>
  )
}
