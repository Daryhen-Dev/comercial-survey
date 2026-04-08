'use client'

import Link from 'next/link'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BranchActionsProps {
  id: number
}

export function BranchActions({ id }: BranchActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/branches/${id}/edit`} aria-label="Editar sucursal">
          <Pencil className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
