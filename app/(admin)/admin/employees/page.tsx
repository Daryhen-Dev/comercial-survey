import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getEmpleados } from '@/lib/queries/employees'
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
import { EmployeeActions } from '@/features/admin/employees/employee-actions'

export const metadata: Metadata = {
  title: 'Empleados | Survey Admin',
}

export default async function EmployeesPage() {
  const empleados = await getEmpleados()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Empleados</h1>
        <Button asChild>
          <Link href="/admin/employees/new">
            <Plus className="mr-2 size-4" />
            Nuevo Empleado
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>CI</TableHead>
              <TableHead>Sucursal Activa</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {empleados.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-8 text-center text-muted-foreground"
                >
                  No hay empleados registrados
                </TableCell>
              </TableRow>
            ) : (
              empleados.map((empleado) => {
                const asignacionActiva = empleado.Sucursales.find(
                  (s) => s.Estado,
                )
                return (
                  <TableRow
                    key={empleado.Id}
                    className={!empleado.Estado ? 'opacity-60' : undefined}
                  >
                    <TableCell className="font-medium">
                      {empleado.Nombre} {empleado.Apellido}
                    </TableCell>
                    <TableCell>{empleado.CI}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {asignacionActiva?.Sucursal.Nombre ?? 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={empleado.Estado ? 'default' : 'secondary'}>
                        {empleado.Estado ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <EmployeeActions id={empleado.Id} estado={empleado.Estado} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
