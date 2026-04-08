import type { Metadata } from 'next'
import { BranchForm } from '@/features/admin/branches/branch-form'
import { createSucursal } from '@/lib/actions/branches'

export const metadata: Metadata = {
  title: 'Nueva Sucursal | Survey Admin',
}

export default function NewBranchPage() {
  return (
    <div className="p-6 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Nueva Sucursal</h1>
      <BranchForm action={createSucursal} />
    </div>
  )
}
