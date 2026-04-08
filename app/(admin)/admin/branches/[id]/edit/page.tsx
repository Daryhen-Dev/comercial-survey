import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getSucursalById } from '@/lib/queries/branches'
import { updateSucursal } from '@/lib/actions/branches'
import { BranchForm } from '@/features/admin/branches/branch-form'

interface EditBranchPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditBranchPageProps): Promise<Metadata> {
  const { id } = await params
  const sucursal = await getSucursalById(parseInt(id))
  return {
    title: sucursal ? `Editar ${sucursal.Nombre} | Survey Admin` : 'Editar Sucursal | Survey Admin',
  }
}

export default async function EditBranchPage({ params }: EditBranchPageProps) {
  const { id } = await params
  const sucursal = await getSucursalById(parseInt(id))

  if (!sucursal) {
    notFound()
  }

  const boundUpdate = updateSucursal.bind(null, sucursal.Id)

  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Editar Sucursal</h1>
      <BranchForm
        action={boundUpdate}
        defaultValues={{
          nombre: sucursal.Nombre,
          direccion: sucursal.Direccion ?? undefined,
        }}
      />
    </div>
  )
}
