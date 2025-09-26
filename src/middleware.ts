// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJWT } from '@/src/lib/auth' // Función personalizada para verificar el JWT

// Lista de rutas públicas (no requieren autenticación)
const PUBLIC_PATHS = ['/', '/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl // Ruta actual de la petición
  const token = request.cookies.get('auth_token')?.value // Token JWT desde las cookies

  const isLoginPage = pathname === '/admin/login'
  const isPublic = PUBLIC_PATHS.includes(pathname)

  // ✅ REDIRECCIÓN DIRECTA DESDE /admin A /admin/login
  // Si el usuario accede directamente a /admin, lo redirigimos a la página de login
  // Esto previene una página en blanco o error si no hay contenido directamente en /admin
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // ✅ REDIRECCIÓN DE USUARIOS AUTENTICADOS DESDE /admin/login AL DASHBOARD
  // Si el usuario ya tiene un token válido y trata de acceder a /admin/login,
  // lo redirigimos automáticamente a /admin/dashboard para evitar que vea la pantalla de login otra vez.
  if (isLoginPage && token) {
    try {
      await verifyJWT(token) // Verifica si el token es válido
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } catch {
      // Si el token es inválido o expiró, lo dejamos seguir al login
    }
  }

  // ✅ ACCESO A RUTAS PÚBLICAS SIN NECESIDAD DE AUTENTICACIÓN
  // Permite el acceso a rutas definidas como públicas sin verificar token
  if (isPublic) return NextResponse.next()

  // ❌ PROTECCIÓN DE RUTAS PRIVADAS
  // Si la ruta no es pública y no hay token, redirige al login
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // ✅ AUTENTICACIÓN CON TOKEN VÁLIDO
  // Verifica que el token sea válido antes de permitir acceso
  try {
    await verifyJWT(token)
    return NextResponse.next()
  } catch {
    // ❌ Si el token no es válido (expirado, mal formado, etc.), redirige al login
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
}

// ⚙️ CONFIGURACIÓN DEL MIDDLEWARE
// Este middleware solo se ejecuta para rutas que empiecen con /admin o sean exactamente /admin
export const config = {
  matcher: ['/admin/:path*', '/admin'], // Asegura que también capture /admin directamente
}
