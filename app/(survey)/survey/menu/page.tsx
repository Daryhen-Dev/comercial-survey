import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ClipboardList, BarChart2 } from 'lucide-react'
import { getSurveySession } from '@/lib/survey-session'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Menú | Portal de Actividades',
}

export default async function SurveyMenuPage() {
  const session = await getSurveySession()
  if (!session) redirect('/survey')

  const empleadoSucursal = await db.empleadoSucursal.findUnique({
    where: { Id: session.empleadoSucursalId },
    include: {
      Empleado: true,
      Sucursal: true,
    },
  })

  if (!empleadoSucursal) redirect('/survey')

  const nombreCompleto = `${empleadoSucursal.Empleado.Nombre} ${empleadoSucursal.Empleado.Apellido}`

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">Bienvenido, {nombreCompleto}</h1>
        <p className="text-sm text-muted-foreground">{empleadoSucursal.Sucursal.Nombre}</p>
      </div>

      <div className="grid gap-4">
        <Link href="/survey/encuestas" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Realizar Actividad</CardTitle>
                <CardDescription>Completá las actividades disponibles para tu sucursal.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/survey/reportes" className="block">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Mis Reportes</CardTitle>
                <CardDescription>Consultá las actividades que completaste esta semana.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  )
}
