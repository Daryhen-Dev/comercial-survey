import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getEncuestaById } from '@/lib/queries/surveys'
import { getParticipacion, isWithinEditWindow } from '@/lib/queries/participation'
import { SurveyFormClient } from '@/features/survey/survey-form-client'
import { getSurveySession } from '@/lib/survey-session'

interface SurveyPageProps {
  params: Promise<{ encuestaId: string }>
}

export async function generateMetadata({
  params,
}: SurveyPageProps): Promise<Metadata> {
  const { encuestaId } = await params
  const encuesta = await getEncuestaById(parseInt(encuestaId))
  return {
    title: encuesta ? `${encuesta.Titulo} | Portal de Encuestas` : 'Encuesta',
  }
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { encuestaId } = await params

  const session = await getSurveySession()
  if (!session) {
    redirect('/survey')
  }

  const encuesta = await getEncuestaById(parseInt(encuestaId))
  if (!encuesta) {
    notFound()
  }

  const empleadoSucursalId = session.empleadoSucursalId

  const participacion = await getParticipacion(empleadoSucursalId, encuesta.Id)

  const canEdit =
    participacion !== null && isWithinEditWindow(participacion.DateCreated)

  // Map Prisma PascalCase to component camelCase props
  const encuestaProps = {
    id: encuesta.Id,
    titulo: encuesta.Titulo,
    descripcion: encuesta.Descripcion,
    preguntas: encuesta.Preguntas.map((p) => ({
      id: p.Id,
      texto: p.Texto,
      tipoPregunta: p.Tipo as 'RADIO' | 'CHECKBOX' | 'BOTH',
      requerida: p.Requerida,
      orden: p.Orden,
      opciones: p.Opciones.map((o) => ({
        id: o.Id,
        texto: o.Texto,
        orden: o.Orden,
      })),
    })),
  }

  const existingParticipacion = participacion
    ? {
        id: participacion.Id,
        dateCreated: participacion.DateCreated,
        respuestas: participacion.Respuestas.map((r) => ({
          preguntaId: r.Pregunta_Id,
          opcionId: r.Opcion_Id,
        })),
      }
    : null

  return (
    <div className="w-full max-w-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">{encuesta.Titulo}</h1>
        {encuesta.Descripcion && (
          <p className="text-sm text-muted-foreground">{encuesta.Descripcion}</p>
        )}
      </div>

      <SurveyFormClient
        encuesta={encuestaProps}
        empleadoSucursalId={empleadoSucursalId}
        existingParticipacion={existingParticipacion}
        canEdit={canEdit}
      />
    </div>
  )
}
