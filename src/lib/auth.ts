// src/lib/auth.ts
import { jwtVerify } from 'jose'

export async function verifyJWT(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

  const { payload } = await jwtVerify(token, secret)

  return payload // contiene sub, email, exp, etc.
}