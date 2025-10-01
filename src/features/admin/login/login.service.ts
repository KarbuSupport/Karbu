import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcryptjs";
import { LoginInput } from "@/src/shared/types/login";
import { permissionMap } from "@/src/shared/diccionary/permissions";

type AuthResult =
  | { success: true; user: { id: string; email: string; name: string; permissions: string[] } }
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

  const permissions = await getPermissionsByRole(user.roleId);

  return {
    success: true,
    user: {
      id: user.id.toString(),
      email: user.email,
      name: user.firstName,
      permissions,
    },
  };
}

async function getPermissionsByRole(role: number) {
  const permissions = await prisma.rolePermission.findMany({
    where: {
      roleId: role,
    },
    include: {
      permission: {
        select: {
          name: true,
        },
      },
    },
  });

  const names = permissions.map((permission: any) => permission.permission.name);

  const normalized = names.map((name: any) => {
    const key = Object.keys(permissionMap).find(
      (k) => permissionMap[k] === name
    );
    return key ?? name;
  });

  return normalized;
}
