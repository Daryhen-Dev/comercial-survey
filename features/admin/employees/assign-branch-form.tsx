'use client'

import { useTransition, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AssignBranchFormProps {
  empleadoId: number
  sucursales: { id: number; nombre: string }[]
  currentSucursalId?: number
  action: (
    empleadoId: number,
    sucursalId: number,
  ) => Promise<{ success: boolean } | { error: string } | undefined>
}

export function AssignBranchForm({
  empleadoId,
  sucursales,
  currentSucursalId,
  action,
}: AssignBranchFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedId, setSelectedId] = useState<number | undefined>(currentSucursalId)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedId) return
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await action(empleadoId, selectedId)
      if (result && 'error' in result) {
        setError(result.error)
      } else {
        setSuccess(true)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          role="status"
          className="rounded-md border border-border bg-muted px-4 py-3 text-sm text-foreground"
        >
          Sucursal asignada correctamente
        </div>
      )}
      <Select
        value={selectedId ? String(selectedId) : undefined}
        onValueChange={(val) => setSelectedId(parseInt(val))}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Seleccioná una sucursal" />
        </SelectTrigger>
        <SelectContent>
          {sucursales.map((s) => (
            <SelectItem key={s.id} value={String(s.id)}>
              {s.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="submit"
        variant="secondary"
        disabled={isPending || !selectedId || selectedId === currentSucursalId}
      >
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        {isPending ? 'Asignando...' : 'Cambiar sucursal'}
      </Button>
    </form>
  )
}
