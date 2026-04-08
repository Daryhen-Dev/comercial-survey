import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface SurveyCardProps {
  encuesta: {
    id: number
    titulo: string
    descripcion?: string | null
    participacion: { id: number } | null
    canEdit: boolean
  }
}

export function SurveyCard({ encuesta }: SurveyCardProps) {
  const surveyLink = `/survey/${encuesta.id}`

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{encuesta.titulo}</CardTitle>
          {encuesta.participacion && (
            <Badge variant="default" className="shrink-0">
              Completado
            </Badge>
          )}
        </div>
        {encuesta.descripcion && (
          <CardDescription>{encuesta.descripcion}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {!encuesta.participacion && (
          <Button asChild size="sm">
            <Link href={surveyLink}>Responder</Link>
          </Button>
        )}
        {encuesta.participacion && encuesta.canEdit && (
          <Button asChild size="sm" variant="outline">
            <Link href={surveyLink}>Editar</Link>
          </Button>
        )}
        {encuesta.participacion && !encuesta.canEdit && (
          <p className="text-sm text-muted-foreground">Vencido</p>
        )}
      </CardContent>
    </Card>
  )
}
