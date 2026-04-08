import type { Metadata } from 'next'

import { getSucursales } from '@/lib/queries/branches'
import { createEmpleado } from '@/lib/actions/employees'
import { EmployeeForm } from '@/features/admin/employees/employee-form'

export const metadata: Metadata = {
  title: 'Nuevo Empleado | Survey Admin',
}

export default async function NewEmployeePage() {
  const sucursales = await getSucursales()

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Nuevo Empleado</h1>
      <EmployeeForm
        action={createEmpleado}
        sucursales={sucursales.map((s) => ({ id: s.Id, nombre: s.Nombre }))}
      />
    </div>
  )
}
