import type { Metadata } from 'next'

import { getSucursales } from '@/lib/queries/branches'
import { createEncuesta } from '@/lib/actions/surveys'
import { SurveyForm } from '@/features/admin/surveys/survey-form'

export const metadata: Metadata = {
  title: 'Nueva Actividad | Admin',
}

export default async function NewSurveyPage() {
  const sucursales = await getSucursales()

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Nueva Actividad</h1>
      <SurveyForm
        action={createEncuesta}
        sucursales={sucursales.map((s) => ({ id: s.Id, nombre: s.Nombre }))}
      />
    </div>
  )
}
