import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getEncuestas } from '@/lib/queries/surveys'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SurveyActions } from '@/features/admin/surveys/survey-actions'

export const metadata: Metadata = {
  title: 'Encuestas | Survey Admin',
}

export default async function SurveysPage() {
  const encuestas = await getEncuestas()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Encuestas</h1>
        <Button asChild>
          <Link href="/admin/surveys/new">
            <Plus className="mr-2 size-4" />
            Nueva Encuesta
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Sucursal</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Preguntas</TableHead>
              <TableHead>Creada</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {encuestas.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay encuestas registradas
                </TableCell>
              </TableRow>
            ) : (
              encuestas.map((encuesta) => (
                <TableRow
                  key={encuesta.Id}
                  className={!encuesta.Activa ? 'opacity-60' : undefined}
                >
                  <TableCell className="font-medium">{encuesta.Titulo}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {encuesta.Sucursal.Nombre}
                  </TableCell>
                  <TableCell>
                    <Badge variant={encuesta.Activa ? 'default' : 'secondary'}>
                      {encuesta.Activa ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {encuesta._count.Preguntas}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {encuesta.CreatedAt.toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell>
                    <SurveyActions id={encuesta.Id} activa={encuesta.Activa} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
