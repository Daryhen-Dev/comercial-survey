import { db } from '@/lib/db'

export async function getParticipacion(
  empleadoSucursalId: number,
  encuestaId: number,
) {
  return db.participacion.findUnique({
    where: {
      EmpleadoSucursal_Id_Encuesta_Id: {
        EmpleadoSucursal_Id: empleadoSucursalId,
        Encuesta_Id: encuestaId,
      },
    },
    include: { Respuestas: true },
  })
}

export function isWithinEditWindow(dateCreated: Date): boolean {
  const fourHoursMs = 4 * 60 * 60 * 1000
  return Date.now() - dateCreated.getTime() <= fourHoursMs
}
