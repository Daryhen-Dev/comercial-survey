import { db } from '@/lib/db'

/** Returns Monday 00:00:00 UTC of the current week */
function getWeekStart(): Date {
  const now = new Date()
  const day = now.getUTCDay() // 0=Sun, 1=Mon...
  const diff = day === 0 ? -6 : 1 - day // shift to Monday
  const monday = new Date(now)
  monday.setUTCDate(now.getUTCDate() + diff)
  monday.setUTCHours(0, 0, 0, 0)
  return monday
}

/** Returns Sunday 23:59:59.999 UTC of the current week */
function getWeekEnd(): Date {
  const start = getWeekStart()
  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  end.setUTCHours(23, 59, 59, 999)
  return end
}

export async function getWeeklyReport() {
  return db.participacion.findMany({
    where: {
      DateCreated: {
        gte: getWeekStart(),
        lte: getWeekEnd(),
      },
    },
    include: {
      EmpleadoSucursal: {
        include: {
          Empleado: true,
          Sucursal: true,
        },
      },
      Encuesta: {
        select: { Id: true, Titulo: true },
      },
    },
    orderBy: [
      { EmpleadoSucursal: { Empleado: { Apellido: 'asc' } } },
      { EmpleadoSucursal: { Empleado: { Nombre: 'asc' } } },
      { DateCreated: 'desc' },
    ],
  })
}

export async function getParticipacionDetalle(id: number) {
  return db.participacion.findUnique({
    where: { Id: id },
    include: {
      EmpleadoSucursal: {
        include: { Empleado: true, Sucursal: true },
      },
      Encuesta: {
        include: {
          Preguntas: {
            orderBy: { Orden: 'asc' },
            include: {
              Opciones: { orderBy: { Orden: 'asc' } },
            },
          },
        },
      },
      Respuestas: {
        include: { Opcion: true },
      },
    },
  })
}
