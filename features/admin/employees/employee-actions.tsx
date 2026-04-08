'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Pencil, PowerOff, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { toggleEmpleadoEstado } from '@/lib/actions/employees'

interface EmployeeActionsProps {
  id: number
  estado: boolean
}

export function EmployeeActions({ id, estado }: EmployeeActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleEmpleadoEstado(id, estado)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/employees/${id}/edit`} aria-label="Editar empleado">
          <Pencil className="size-4" />
        </Link>
      </Button>

      <ConfirmDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label={estado ? 'Desactivar empleado' : 'Activar empleado'}
          >
            {estado ? (
              <PowerOff className="size-4 text-destructive" />
            ) : (
              <Power className="size-4 text-muted-foreground" />
            )}
          </Button>
        }
        title={estado ? 'Desactivar empleado' : 'Activar empleado'}
        description={
          estado
            ? '¿Estás seguro de que querés desactivar este empleado?'
            : '¿Estás seguro de que querés activar este empleado?'
        }
        onConfirm={handleToggle}
        destructive={estado}
      />
    </div>
  )
}
