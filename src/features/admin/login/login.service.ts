import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginInput } from "@/src/shared/types/login";

type AuthResult =
  | { success: true; user: { id: string; email: string; name: string; role: string } }
  | { success: false; error: string };

export async function authenticateUser({ email, passwordHash }: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordHash) {
    return { success: false, error: "Credenciales inválidas" };
  }

  const isPasswordValid = await bcrypt.compare(passwordHash, user.passwordHash);

  if (!isPasswordValid) {
    return { success: false, error: "Credenciales inválidas" };
  }

  return {
    success: true,
    user: {
      id: user.id.toString(),
      email: user.email,
      name: user.firstName,
      role: user.roleId.toString(),
    },
  };
}
