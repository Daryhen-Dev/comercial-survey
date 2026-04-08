import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckSquare, Square } from 'lucide-react'
import { getParticipacionDetalle } from '@/lib/queries/reports'
import { getSurveySession } from '@/lib/survey-session'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface Props {
  params: Promise<{ participacionId: string }>
}

export default async function RespuestasPage({ params }: Props) {
  const { participacionId } = await params

  const session = await getSurveySession()
  if (!session) redirect('/survey')

  const participacion = await getParticipacionDetalle(parseInt(participacionId))
  if (!participacion) notFound()

  if (participacion.EmpleadoSucursal_Id !== session.empleadoSucursalId) {
    notFound()
  }

  const opcionesSeleccionadas = new Set(participacion.Respuestas.map((r) => r.Opcion_Id))

  return (
    <div className="w-full max-w-2xl space-y-6 pb-12">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/survey">
          <ArrowLeft className="mr-1 size-4" />
          Volver
        </Link>
      </Button>

      <div>
        <h1 className="text-xl font-bold">{participacion.Encuesta.Titulo}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {participacion.EmpleadoSucursal.Empleado.Nombre}{' '}
          {participacion.EmpleadoSucursal.Empleado.Apellido}
          {' · '}
          {participacion.EmpleadoSucursal.Sucursal.Nombre}
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        {participacion.Encuesta.Preguntas.map((pregunta, idx) => (
          <Card key={pregunta.Id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium leading-snug">
                <span className="text-muted-foreground mr-2">{idx + 1}.</span>
                {pregunta.Texto}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {pregunta.Opciones.map((opcion) => {
                const selected = opcionesSeleccionadas.has(opcion.Id)
                return (
                  <div
                    key={opcion.Id}
                    className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                      selected
                        ? 'bg-primary/10 text-foreground font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {selected ? (
                      <CheckSquare className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Square className="size-4 shrink-0 text-muted-foreground/30" />
                    )}
                    {opcion.Texto}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
