import { db } from '@/lib/db'

export async function getSucursales() {
  return db.sucursal.findMany({ orderBy: { Nombre: 'asc' } })
}

export async function getSucursalById(id: number) {
  return db.sucursal.findUnique({ where: { Id: id } })
}
