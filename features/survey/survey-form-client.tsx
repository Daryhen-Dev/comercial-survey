'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { QuestionItem } from '@/features/survey/question-item'
import { submitParticipacion, updateParticipacion } from '@/lib/actions/participation'

interface SurveyFormClientProps {
  encuesta: {
    id: number
    titulo: string
    descripcion?: string | null
    preguntas: Array<{
      id: number
      texto: string
      tipoPregunta: 'RADIO' | 'CHECKBOX' | 'BOTH'
      requerida: boolean
      orden: number
      opciones: { id: number; texto: string; orden: number }[]
    }>
  }
  empleadoSucursalId: number
  existingParticipacion: {
    id: number
    dateCreated: Date
    respuestas: { preguntaId: number; opcionId: number }[]
  } | null
  canEdit: boolean
}

function buildInitialAnswers(
  respuestas: { preguntaId: number; opcionId: number }[],
): Record<number, number[]> {
  return respuestas.reduce<Record<number, number[]>>((acc, r) => {
    if (!acc[r.preguntaId]) acc[r.preguntaId] = []
    acc[r.preguntaId].push(r.opcionId)
    return acc
  }, {})
}

function formatTimeRemaining(dateCreated: Date): string {
  const fourHoursMs = 4 * 60 * 60 * 1000
  const elapsed = Date.now() - dateCreated.getTime()
  const remaining = fourHoursMs - elapsed
  if (remaining <= 0) return '0 minutos'
  const hours = Math.floor(remaining / (60 * 60 * 1000))
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000))
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes} minutos`
}

export function SurveyFormClient({
  encuesta,
  empleadoSucursalId,
  existingParticipacion,
  canEdit,
}: SurveyFormClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const initialAnswers: Record<number, number[]> = existingParticipacion
    ? buildInitialAnswers(existingParticipacion.respuestas)
    : {}

  const [answers, setAnswers] = useState<Record<number, number[]>>(initialAnswers)
  const [fieldErrors, setFieldErrors] = useState<Record<number, string>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const isReadOnly = existingParticipacion !== null && !canEdit

  const sortedPreguntas = [...encuesta.preguntas].sort((a, b) => a.orden - b.orden)

  const handleAnswerChange = (preguntaId: number, opcionIds: number[]) => {
    setAnswers((prev) => ({ ...prev, [preguntaId]: opcionIds }))
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[preguntaId]
      return next
    })
  }

  const validate = (): boolean => {
    const errors: Record<number, string> = {}
    for (const pregunta of sortedPreguntas) {
      if (pregunta.requerida) {
        const selected = answers[pregunta.id] ?? []
        if (selected.length === 0) {
          errors[pregunta.id] = 'Esta pregunta es requerida'
        }
      }
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const respuestas = Object.entries(answers)
      .filter(([, opcionIds]) => opcionIds.length > 0)
      .map(([preguntaId, opcionIds]) => ({
        preguntaId: parseInt(preguntaId),
        opcionIds,
      }))

    const values = {
      encuestaId: encuesta.id,
      empleadoSucursalId,
      respuestas,
    }

    startTransition(async () => {
      setGlobalError(null)

      if (existingParticipacion) {
        const result = await updateParticipacion(existingParticipacion.id, values)
        if ('error' in result) {
          if (result.error === 'EDIT_WINDOW_EXPIRED') {
            setGlobalError('El tiempo de edición ha expirado')
          } else {
            setGlobalError('Ocurrió un error al guardar los cambios')
          }
          return
        }
      } else {
        const result = await submitParticipacion(values)
        if ('error' in result) {
          if (result.error === 'ALREADY_PARTICIPATED') {
            setGlobalError('Ya completaste esta encuesta')
          } else {
            setGlobalError('Ocurrió un error al enviar la encuesta')
          }
          return
        }
      }

      toast.success('Encuesta enviada correctamente')
      router.push('/survey')
    })
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Read-only / edit window notices */}
      {isReadOnly && (
        <div className="rounded-md border border-border bg-muted px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Tiempo de edición vencido. Tus respuestas están guardadas pero ya no se pueden modificar.
          </p>
        </div>
      )}

      {existingParticipacion && canEdit && (
        <div className="rounded-md border border-border bg-muted px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Podés modificar tus respuestas. Tiempo restante:{' '}
            <span className="font-medium text-foreground">
              {formatTimeRemaining(existingParticipacion.dateCreated)}
            </span>
          </p>
        </div>
      )}

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {sortedPreguntas.map((pregunta) => (
          <QuestionItem
            key={pregunta.id}
            pregunta={pregunta}
            value={answers[pregunta.id] ?? []}
            onChange={(opcionIds) => handleAnswerChange(pregunta.id, opcionIds)}
            error={fieldErrors[pregunta.id]}
            readOnly={isReadOnly}
          />
        ))}
      </div>

      {/* Global error */}
      {globalError && (
        <p className="text-sm text-destructive" role="alert">
          {globalError}
        </p>
      )}

      {/* Submit button — hidden when read-only */}
      {!isReadOnly && (
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {existingParticipacion ? 'Guardar cambios' : 'Enviar encuesta'}
        </Button>
      )}
    </div>
  )
}
