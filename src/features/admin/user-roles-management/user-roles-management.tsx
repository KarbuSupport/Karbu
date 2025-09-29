"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/shared/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/card"
import { Input } from "@/src/shared/components/ui/input"
import { Label } from "@/src/shared/components/ui/label"
import { Textarea } from "@/src/shared/components/ui/textarea"
import { Badge } from "@/src/shared/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/shared/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/shared/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/shared/components/ui/select"
import { Checkbox } from "@/src/shared/components/ui/checkbox"
import { useToast } from "@/src/shared/hooks/use-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/shared/components/ui/dialog"
import { Plus, Edit, Trash2, Search, XCircle, CheckCircle, Loader2 } from "lucide-react"

import type { RoleWithPermissions, Permission, UserWithRole } from "@/src/lib/types"
import { createUser, deleteUser, getUsers, updateUser } from "./actions/user.actions"
import { createRole, deleteRole, getRoles, updateRole } from "./actions/roles.actions"
import { getPermissions } from "./actions/permission.actions"

export function RolesManagement() {
  const [users, setUsers] = useState<UserWithRole[]>([])
  const [roles, setRoles] = useState<RoleWithPermissions[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  const [isNewSystemUserOpen, setIsNewSystemUserOpen] = useState(false)
  const [isNewRoleOpen, setIsNewRoleOpen] = useState(false)
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [editingRole, setEditingRole] = useState<RoleWithPermissions | null>(null)
  const [editingUser, setEditingUser] = useState<UserWithRole | null>(null)

  // Form states
  const [roleForm, setRoleForm] = useState({ name: "", description: "" })
  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName1: "",
    lastName2: "",
    email: "",
    password: "",
    roleId: "",
  })

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usersResult, rolesResult, permissionsResult] = await Promise.all([
        getUsers(),
        getRoles(),
        getPermissions(),
      ])

      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data)
      }

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data)
      }

      if (permissionsResult.success && permissionsResult.data) {
        setPermissions(permissionsResult.data)
      } else {
        // If no permissions exist, seed them
        // const seedResult = await seedPermissions()
        // if (seedResult.success && seedResult.data) {
          // setPermissions(seedResult.data)
        // }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((p) => p !== permissionId) : [...prev, permissionId],
    )
  }

  const hasPermission = (role: RoleWithPermissions, permissionId: number) => {
    return role.permissions?.some((rp) => rp.permission?.id === permissionId) ?? false;
  }
  const handleRoleSubmit = async () => {
    if (!roleForm.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      })
      return
    }

    try {
      let result
      
      if (editingRole?.id != null) {
        result = await updateRole(
          editingRole.id,
          roleForm.name,
          roleForm.description || null,
          selectedPermissions
        )
      } else {
        result = await createRole(
          roleForm.name,
          roleForm.description || null,
          selectedPermissions
        )
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `Role ${editingRole ? "updated" : "created"} successfully`,
        })
        setIsNewRoleOpen(false)
        setEditingRole(null)
        setRoleForm({ name: "", description: "" })
        setSelectedPermissions([])
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save role",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleUserSubmit = async () => {
    if (!userForm.firstName.trim() || !userForm.email.trim() || !userForm.roleId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      let result
      if (editingUser) {
        result = await updateUser(
          editingUser.id,
          userForm.firstName,
          userForm.lastName1,
          userForm.lastName2,
          userForm.email,
          Number.parseInt(userForm.roleId),
          userForm.password || undefined,
        )
      } else {
        if (!userForm.password) {
          toast({
            title: "Error",
            description: "Password is required for new users",
            variant: "destructive",
          })
          return
        }
        result = await createUser(
          userForm.firstName,
          userForm.lastName1,
          userForm.lastName2,
          userForm.email,
          userForm.password,
          Number.parseInt(userForm.roleId),
        )
      }

      if (result.success) {
        toast({
          title: "Success",
          description: `User ${editingUser ? "updated" : "created"} successfully`,
        })
        setIsNewSystemUserOpen(false)
        setEditingUser(null)
        setUserForm({
          firstName: "",
          lastName1: "",
          lastName2: "",
          email: "",
          password: "",
          roleId: "",
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save user",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRole = async (roleId: number) => {
    if (confirm("Are you sure you want to delete this role?")) {
      try {
        const result = await deleteRole(roleId)
        if (result.success) {
          toast({
            title: "Success",
            description: "Role deleted successfully",
          })
          loadData()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete role",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await deleteUser(userId)
        if (result.success) {
          toast({
            title: "Success",
            description: "User deleted successfully",
          })
          loadData()
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete user",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditRole = (role: RoleWithPermissions) => {
    setEditingRole(role)
    setRoleForm({ name: role.name || "", description: role.description || "" })
    setSelectedPermissions(role.permissions ? role.permissions.map((rp: any) => rp.permission.id) : [])
    setIsNewRoleOpen(true)
  }

  const handleEditUser = (user: UserWithRole) => {
    setEditingUser(user)
    setUserForm({
      firstName: user.firstName || "",
      lastName1: user.lastName1 || "",
      lastName2: user.lastName2 || "",
      email: user.email || "",
      password: "",
      roleId: user.roleId ? user.roleId.toString() : "",
    })
    setIsNewSystemUserOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Roles y Permisos</h1>
          <p className="text-muted-foreground">Administra usuarios del sistema, roles y permisos de acceso</p>
        </div>
      </div>

      <Tabs defaultValue="system-users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system-users" className="hover:cursor-pointer">Usuarios del Sistema</TabsTrigger>
          <TabsTrigger value="roles" className="hover:cursor-pointer">Roles</TabsTrigger>
          <TabsTrigger value="permissions" className="hover:cursor-pointer">Permisos</TabsTrigger>
        </TabsList>

        {/* Usuarios del Sistema */}
        <TabsContent value="system-users" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Usuarios del Sistema</h2>
              <p className="text-muted-foreground">Gestiona los usuarios que tienen acceso al panel administrativo</p>
            </div>
            <Dialog
              open={isNewSystemUserOpen}
              onOpenChange={(open) => {
                setIsNewSystemUserOpen(open)
                if (!open) {
                  setEditingUser(null)
                  setUserForm({
                    firstName: "",
                    lastName1: "",
                    lastName2: "",
                    email: "",
                    password: "",
                    roleId: "",
                  })
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 hover:cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Usuario Sistema
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Editar" : "Crear"} Usuario del Sistema</DialogTitle>
                  <DialogDescription>
                    {editingUser ? "Modifica" : "Agrega"} un usuario con acceso al panel administrativo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sys-firstName">Nombres</Label>
                    <Input
                      id="sys-firstName"
                      placeholder="María"
                      value={userForm.firstName}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sys-lastName1">Apellido Paterno</Label>
                    <Input
                      id="sys-lastName1"
                      placeholder="González"
                      value={userForm.lastName1}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, lastName1: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sys-lastName2">Apellido Materno</Label>
                    <Input
                      id="sys-lastName2"
                      placeholder="López"
                      value={userForm.lastName2}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, lastName2: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sys-email">Correo Electrónico</Label>
                    <Input
                      id="sys-email"
                      type="email"
                      placeholder="maria@tallermendez.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sys-role">Rol</Label>
                    <Select
                      value={userForm.roleId}
                      onValueChange={(value) => setUserForm((prev) => ({ ...prev, roleId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role: any) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sys-password">{editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}</Label>
                    <Input
                      id="sys-password"
                      type="password"
                      placeholder="••••••••"
                      value={userForm.password}
                      onChange={(e) => setUserForm((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsNewSystemUserOpen(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleUserSubmit} className="flex-1 bg-accent hover:bg-accent/90">
                      {editingUser ? "Actualizar" : "Crear"} Usuario
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Usuarios Activos</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input placeholder="Buscar usuarios del sistema..." className="w-64" />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Permisos</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: any) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName1} {user.lastName2}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role ? user.role.name : ""}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-48">
                          <p className="text-sm truncate">
                            {roles?.find(role => role.id === user.roleId)?.permissions?.length ?? 0} permisos
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{user.createdAt ? user.createdAt.toLocaleDateString() : ""}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles */}
        <TabsContent value="roles" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Gestión de Roles</h2>
              <p className="text-muted-foreground">Define y administra los roles disponibles en el sistema</p>
            </div>
            <Dialog
              open={isNewRoleOpen}
              onOpenChange={(open) => {
                setIsNewRoleOpen(open)
                if (!open) {
                  setEditingRole(null)
                  setRoleForm({ name: "", description: "" })
                  setSelectedPermissions([])
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90 hover:cursor-pointer">
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Rol
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingRole ? "Editar" : "Crear Nuevo"} Rol</DialogTitle>
                  <DialogDescription>
                    {editingRole ? "Modifica" : "Define"} un rol con permisos específicos
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="role-name">Nombre del Rol</Label>
                    <Input
                      id="role-name"
                      placeholder="Ej: Contador"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-desc">Descripción</Label>
                    <Textarea
                      id="role-desc"
                      placeholder="Describe las responsabilidades de este rol"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>Permisos ({selectedPermissions.length} seleccionados)</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto border rounded-md p-3">
                      {permissions.map((permission: any) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <Label htmlFor={`permission-${permission.id}`} className="text-sm cursor-pointer">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsNewRoleOpen(false)} variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                    <Button onClick={handleRoleSubmit} className="flex-1 bg-accent hover:bg-accent/90">
                      {editingRole ? "Actualizar" : "Crear"} Rol
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role: any) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant="secondary">{users.filter((u) => u.roleId === role.id).length} usuarios</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Permisos ({role.permissions.length}):</Label>
                      <div className="mt-1 max-h-32 overflow-y-auto space-y-1">
                        {role.permissions.slice(0, 5).map((rp: any, index: any) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{rp.permission.name}</span>
                          </div>
                        ))}
                        {role.permissions.length > 5 && (
                          <div className="text-sm text-muted-foreground pl-5">
                            +{role.permissions.length - 5} permisos más...
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive bg-transparent"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permisos */}
        <TabsContent value="permissions" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Matriz de Permisos</h2>
            <p className="text-muted-foreground">Visualiza y gestiona los permisos por rol</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Permisos por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 min-w-48">Permiso</th>
                      {roles.map((role: any) => (
                        <th key={role.id} className="text-center py-2 px-4 min-w-32">
                          {role.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission: any) => (
                      <tr key={permission.id} className="border-b hover:bg-accent-foreground">
                        <td className="py-3 px-4 font-medium">{permission.name}</td>
                        {roles.map((role: any) => (
                          <td key={role.id} className="text-center py-3 px-4">
                            {hasPermission(role, permission.id) ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
