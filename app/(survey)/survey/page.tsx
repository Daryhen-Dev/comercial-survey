import type { Metadata } from 'next'
import { CiLookupForm } from '@/features/survey/ci-lookup-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Portal de Actividades',
}

export default function SurveyPortalPage() {
  return (
    <div className="w-full max-w-md space-y-8">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Actividades</CardTitle>
          <CardDescription>
            Ingresá tu cédula de identidad para ver las actividades disponibles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CiLookupForm />
        </CardContent>
      </Card>
    </div>
  )
}
