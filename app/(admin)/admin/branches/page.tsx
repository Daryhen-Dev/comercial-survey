import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { getSucursales } from '@/lib/queries/branches'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BranchActions } from '@/features/admin/branches/branch-actions'

export const metadata: Metadata = {
  title: 'Sucursales | Survey Admin',
}

export default async function BranchesPage() {
  const sucursales = await getSucursales()

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sucursales</h1>
        <Button asChild>
          <Link href="/admin/branches/new">
            <Plus className="mr-2 size-4" />
            Nueva Sucursal
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sucursales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="py-8 text-center text-muted-foreground">
                  No hay sucursales registradas
                </TableCell>
              </TableRow>
            ) : (
              sucursales.map((sucursal) => (
                <TableRow key={sucursal.Id}>
                  <TableCell className="font-medium">{sucursal.Nombre}</TableCell>
                  <TableCell>
                    <BranchActions id={sucursal.Id} />
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
