import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getSurveySession } from '@/lib/survey-session'
import { db } from '@/lib/db'
import { getEncuestasBySucursal } from '@/lib/queries/surveys'
import { getParticipacion, isWithinEditWindow } from '@/lib/queries/participation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Encuestas Disponibles | Portal de Encuestas',
}

export default async function EncuestasPage() {
  const session = await getSurveySession()
  if (!session) redirect('/survey')

  const empleadoSucursal = await db.empleadoSucursal.findUnique({
    where: { Id: session.empleadoSucursalId },
    include: { Sucursal: true },
  })

  if (!empleadoSucursal) redirect('/survey')

  const encuestas = await getEncuestasBySucursal(empleadoSucursal.Sucursal_Id)

  const encuestasWithStatus = await Promise.all(
    encuestas.map(async (encuesta) => {
      const participacion = await getParticipacion(session.empleadoSucursalId, encuesta.Id)
      const canEdit = participacion !== null && isWithinEditWindow(participacion.DateCreated)
      return {
        id: encuesta.Id,
        titulo: encuesta.Titulo,
        descripcion: encuesta.Descripcion,
        participacionId: participacion?.Id ?? null,
        canEdit,
        completada: participacion !== null,
      }
    }),
  )

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/survey/menu">
            <ChevronLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-xl font-semibold text-foreground">Encuestas Disponibles</h1>
      </div>

      {encuestasWithStatus.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              No hay encuestas activas para tu sucursal.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {encuestasWithStatus.map((encuesta) => (
            <Card key={encuesta.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{encuesta.titulo}</CardTitle>
                  {encuesta.completada ? (
                    <Badge variant={encuesta.canEdit ? 'outline' : 'secondary'}>
                      {encuesta.canEdit ? 'Editable' : 'Completada'}
                    </Badge>
                  ) : (
                    <Badge variant="default">Pendiente</Badge>
                  )}
                </div>
                {encuesta.descripcion && (
                  <CardDescription>{encuesta.descripcion}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                {!encuesta.completada || encuesta.canEdit ? (
                  <Button size="sm" asChild>
                    <Link href={`/survey/${encuesta.id}`}>
                      {encuesta.completada ? 'Editar respuestas' : 'Completar encuesta'}
                    </Link>
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/survey/respuestas/${encuesta.participacionId}`}>
                      Ver respuestas
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
