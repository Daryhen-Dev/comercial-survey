import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/login-form'

export const metadata: Metadata = {
  title: 'Login | Actividades admin',
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Actividades admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresá tus credenciales para continuar
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
