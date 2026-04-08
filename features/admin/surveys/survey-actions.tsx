'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Pencil, PowerOff, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { toggleEncuestaEstado } from '@/lib/actions/surveys'

interface SurveyActionsProps {
  id: number
  activa: boolean
}

export function SurveyActions({ id, activa }: SurveyActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      await toggleEncuestaEstado(id, activa)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/surveys/${id}/edit`} aria-label="Editar encuesta">
          <Pencil className="size-4" />
        </Link>
      </Button>

      <ConfirmDialog
        trigger={
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            aria-label={activa ? 'Desactivar encuesta' : 'Activar encuesta'}
          >
            {activa ? (
              <PowerOff className="size-4 text-destructive" />
            ) : (
              <Power className="size-4 text-muted-foreground" />
            )}
          </Button>
        }
        title={activa ? 'Desactivar encuesta' : 'Activar encuesta'}
        description={
          activa
            ? '¿Estás seguro de que querés desactivar esta encuesta?'
            : '¿Estás seguro de que querés activar esta encuesta?'
        }
        onConfirm={handleToggle}
        destructive={activa}
      />
    </div>
  )
}
