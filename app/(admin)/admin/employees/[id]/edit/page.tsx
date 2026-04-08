import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEmpleadoById } from '@/lib/queries/employees'
import { getSucursales } from '@/lib/queries/branches'
import { updateEmpleado, assignEmpleadoSucursal } from '@/lib/actions/employees'
import { EmployeeForm } from '@/features/admin/employees/employee-form'
import { AssignBranchForm } from '@/features/admin/employees/assign-branch-form'

interface EditEmployeePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: EditEmployeePageProps): Promise<Metadata> {
  const { id } = await params
  const empleado = await getEmpleadoById(parseInt(id))
  return {
    title: empleado
      ? `Editar ${empleado.Nombre} ${empleado.Apellido} | Survey Admin`
      : 'Editar Empleado | Survey Admin',
  }
}

export default async function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { id } = await params
  const [empleado, sucursales] = await Promise.all([
    getEmpleadoById(parseInt(id)),
    getSucursales(),
  ])

  if (!empleado) {
    notFound()
  }

  const boundUpdate = updateEmpleado.bind(null, empleado.Id)
  const asignacionActiva = empleado.Sucursales.find((s) => s.Estado)

  return (
    <div className="p-6 max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">
          Editar Empleado — {empleado.Nombre} {empleado.Apellido}
        </h1>
        <EmployeeForm
          action={boundUpdate}
          defaultValues={{
            nombre: empleado.Nombre,
            apellido: empleado.Apellido,
            ci: empleado.CI,
            estado: empleado.Estado,
          }}
          sucursales={sucursales.map((s) => ({ id: s.Id, nombre: s.Nombre }))}
          defaultSucursalId={asignacionActiva?.Sucursal_Id}
        />
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Cambiar Sucursal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sucursal actual:{' '}
            <span className="font-medium text-foreground">
              {asignacionActiva?.Sucursal.Nombre ?? 'Sin asignar'}
            </span>
          </p>
        </div>
        <AssignBranchForm
          empleadoId={empleado.Id}
          sucursales={sucursales.map((s) => ({ id: s.Id, nombre: s.Nombre }))}
          currentSucursalId={asignacionActiva?.Sucursal_Id}
          action={assignEmpleadoSucursal}
        />
      </div>
    </div>
  )
}
