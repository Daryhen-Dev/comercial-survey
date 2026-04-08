'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { lookupByCi, type LookupResult } from '@/lib/actions/lookup'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type FormState = LookupResult | null

async function lookupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const ci = (formData.get('ci') as string) ?? ''
  return lookupByCi(ci.trim())
}

export function CiLookupForm() {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState(lookupAction, null)

  const isSuccess = state !== null && !('error' in state)

  // Once session is set server-side, navigate to the menu
  useEffect(() => {
    if (isSuccess) router.push('/survey/menu')
  }, [isSuccess, router])

  return (
    <div className="space-y-4">
      <form action={formAction} className="flex gap-2">
        <Input
          name="ci"
          placeholder="Ingresá tu CI"
          className="flex-1"
          aria-label="Cédula de Identidad"
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Ingresar'}
        </Button>
      </form>

      {state && 'error' in state && (
        <p className="text-sm text-destructive" role="alert">
          {state.error === 'EMPLOYEE_NOT_FOUND' && 'Empleado no encontrado.'}
          {state.error === 'NO_ACTIVE_BRANCH' && 'No tenés una sucursal activa asignada.'}
          {state.error === 'RATE_LIMITED' && 'Demasiados intentos. Esperá un minuto.'}
        </p>
      )}
    </div>
  )
}
