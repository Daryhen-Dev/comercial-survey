'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { EmployeeFormValues } from '@/lib/validations/employee'

export async function createEmpleado(
  values: EmployeeFormValues & { sucursalId?: number },
) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  const existing = await db.empleado.findFirst({ where: { CI: values.ci } })
  if (existing) return { error: 'CI ya registrado' }

  try {
    const empleado = await db.empleado.create({
      data: {
        Nombre: values.nombre,
        Apellido: values.apellido,
        CI: values.ci,
        Estado: values.estado ?? true,
      },
    })

    if (values.sucursalId) {
      await db.empleadoSucursal.create({
        data: {
          Empleado_Id: empleado.Id,
          Sucursal_Id: values.sucursalId,
          Estado: true,
        },
      })
    }

    revalidatePath('/admin/employees')
  } catch {
    return { error: 'Error al crear el empleado' }
  }

  redirect('/admin/employees')
}

export async function updateEmpleado(id: number, values: EmployeeFormValues) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.empleado.update({
      where: { Id: id },
      data: {
        Nombre: values.nombre,
        Apellido: values.apellido,
        CI: values.ci,
        Estado: values.estado ?? true,
      },
    })
    revalidatePath('/admin/employees')
  } catch {
    return { error: 'Error al actualizar el empleado' }
  }

  redirect('/admin/employees')
}

export async function toggleEmpleadoEstado(id: number, estado: boolean) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.empleado.update({
      where: { Id: id },
      data: { Estado: !estado },
    })
    revalidatePath('/admin/employees')
    return { success: true }
  } catch {
    return { error: 'Error al actualizar el estado del empleado' }
  }
}

export async function assignEmpleadoSucursal(
  empleadoId: number,
  sucursalId: number,
) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.$transaction([
      db.empleadoSucursal.updateMany({
        where: { Empleado_Id: empleadoId },
        data: { Estado: false, FechaFin: new Date() },
      }),
      db.empleadoSucursal.create({
        data: {
          Empleado_Id: empleadoId,
          Sucursal_Id: sucursalId,
          Estado: true,
        },
      }),
    ])
    revalidatePath('/admin/employees')
    return { success: true }
  } catch {
    return { error: 'Error al asignar la sucursal' }
  }
}
