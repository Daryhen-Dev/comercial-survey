import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getSurveySession } from '@/lib/survey-session'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Mis Reportes | Portal de Encuestas',
}

function getWeekStart(): Date {
  const now = new Date()
  const day = now.getUTCDay()
  const diff = day === 0 ? -6 : 1 - day
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

export default async function ReportesPage() {
  const session = await getSurveySession()
  if (!session) redirect('/survey')

  const participaciones = await db.participacion.findMany({
    where: {
      EmpleadoSucursal_Id: session.empleadoSucursalId,
      DateCreated: { gte: getWeekStart() },
    },
    include: {
      Encuesta: { select: { Id: true, Titulo: true } },
    },
    orderBy: { DateCreated: 'desc' },
  })

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/survey/menu">
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Mis Reportes</h1>
      </div>

      <p className="text-sm text-muted-foreground">Encuestas completadas esta semana.</p>

      {participaciones.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              No completaste ninguna encuesta esta semana.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {participaciones.map((p) => (
            <Card key={p.Id}>
              <CardContent className="flex items-center justify-between gap-4 pt-4 pb-4">
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.Encuesta.Titulo}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(p.DateCreated).toLocaleDateString('es-UY', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild className="shrink-0">
                  <Link href={`/survey/respuestas/${p.Id}`}>Ver</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
