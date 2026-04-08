import { db } from '@/lib/db'

export async function getEmpleados() {
  return db.empleado.findMany({
    include: {
      Sucursales: {
        where: { Estado: true },
        include: {
          Sucursal: { select: { Id: true, Nombre: true } },
        },
      },
    },
    orderBy: { Nombre: 'asc' },
  })
}

export async function getEmpleadoById(id: number) {
  return db.empleado.findUnique({
    where: { Id: id },
    include: {
      Sucursales: {
        include: {
          Sucursal: { select: { Id: true, Nombre: true } },
        },
        orderBy: { FechaInicio: 'desc' },
      },
    },
  })
}

export async function getEmpleadoByCi(ci: string) {
  return db.empleado.findFirst({
    where: { CI: ci, Estado: true },
  })
}
