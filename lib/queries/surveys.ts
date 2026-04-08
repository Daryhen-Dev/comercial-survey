import { db } from '@/lib/db'

export async function getEncuestas() {
  return db.encuesta.findMany({
    include: {
      Sucursal: true,
      _count: {
        select: { Preguntas: true },
      },
    },
    orderBy: { CreatedAt: 'desc' },
  })
}

export async function getEncuestaById(id: number) {
  return db.encuesta.findUnique({
    where: { Id: id },
    include: {
      Sucursal: true,
      Preguntas: {
        orderBy: { Orden: 'asc' },
        include: {
          Opciones: {
            orderBy: { Orden: 'asc' },
          },
        },
      },
    },
  })
}

export async function getEncuestasBySucursal(sucursalId: number) {
  return db.encuesta.findMany({
    where: {
      Sucursal_Id: sucursalId,
      Activa: true,
    },
    include: {
      Preguntas: {
        orderBy: { Orden: 'asc' },
        include: {
          Opciones: {
            orderBy: { Orden: 'asc' },
          },
        },
      },
    },
    orderBy: { CreatedAt: 'desc' },
  })
}
