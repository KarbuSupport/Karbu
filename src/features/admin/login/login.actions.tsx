'use server'

import { authenticateUser } from '@/src/features/admin/login/login.service'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

export async function loginAction(_: unknown, formData: FormData) {
  try {
    const email = formData.get('email') as string | null
    const passwordHash = formData.get('password') as string | null

    if (!email || !passwordHash) {
      return { success: false, message: "Email y contraseña son requeridos" }
    }

    const authResult = await authenticateUser({ email, passwordHash })

    if (!authResult.success) {
      return { success: false, message: authResult.error }
    }

    const user = authResult.user

    const token = sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    cookies().set('auth_token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return { success: true }
  } catch (error) {
    console.error('Error en loginAction:', error)
    return { success: false, message: "Error interno del servidor" }
  }
}
