'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { BranchFormValues } from '@/lib/validations/branch'

export async function createSucursal(values: BranchFormValues) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.sucursal.create({ data: { Nombre: values.nombre } })
    revalidatePath('/admin/branches')
  } catch {
    return { error: 'Error al crear la sucursal' }
  }

  redirect('/admin/branches')
}

export async function updateSucursal(id: number, values: BranchFormValues) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.sucursal.update({
      where: { Id: id },
      data: { Nombre: values.nombre },
    })
    revalidatePath('/admin/branches')
  } catch {
    return { error: 'Error al actualizar la sucursal' }
  }

  redirect('/admin/branches')
}
