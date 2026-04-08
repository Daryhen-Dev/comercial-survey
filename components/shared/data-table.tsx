import { cn } from '@/lib/utils'

interface DataTableProps {
  children: React.ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-md border', className)}>
      <table className="w-full caption-bottom text-sm">
        {children}
      </table>
    </div>
  )
}
