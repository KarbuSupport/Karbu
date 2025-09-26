import { LoginForm } from "@/src/features/admin/login/login-form"

export default function LoginPage() {
  return (
    <div className="karbu-theme min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}
