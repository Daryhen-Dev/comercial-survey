import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEncuestaById } from '@/lib/queries/surveys'
import { getSucursales } from '@/lib/queries/branches'
import { updateEncuesta } from '@/lib/actions/surveys'
import { SurveyForm } from '@/features/admin/surveys/survey-form'
import type { SurveyFormValues } from '@/lib/validations/survey'

interface EditSurveyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditSurveyPageProps): Promise<Metadata> {
  const { id } = await params
  const encuesta = await getEncuestaById(parseInt(id))
  return {
    title: encuesta
      ? `Editar ${encuesta.Titulo} | Survey Admin`
      : 'Editar Actividad | Admin',
  }
}

export default async function EditSurveyPage({ params }: EditSurveyPageProps) {
  const { id } = await params
  const [encuesta, sucursales] = await Promise.all([
    getEncuestaById(parseInt(id)),
    getSucursales(),
  ])

  if (!encuesta) {
    notFound()
  }

  const defaultValues: SurveyFormValues = {
    titulo: encuesta.Titulo,
    descripcion: encuesta.Descripcion ?? undefined,
    sucursalId: encuesta.Sucursal_Id,
    preguntas: encuesta.Preguntas.map((p) => ({
      texto: p.Texto,
      tipoPregunta: p.Tipo as 'RADIO' | 'CHECKBOX' | 'BOTH',
      orden: p.Orden,
      requerida: p.Requerida,
      opciones: p.Opciones.map((o) => ({
        texto: o.Texto,
        orden: o.Orden,
      })),
    })),
  }

  const boundUpdate = updateEncuesta.bind(null, encuesta.Id)

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Editar Actividad</h1>
      <SurveyForm
        action={boundUpdate}
        defaultValues={defaultValues}
        sucursales={sucursales.map((s) => ({ id: s.Id, nombre: s.Nombre }))}
      />
    </div>
  )
}
