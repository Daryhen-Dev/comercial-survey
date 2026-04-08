'use server'

import { db } from '@/lib/db'
import { getParticipacion, isWithinEditWindow } from '@/lib/queries/participation'
import type { ParticipationFormValues } from '@/lib/validations/participation'

export async function submitParticipacion(values: ParticipationFormValues) {
  const existing = await getParticipacion(
    values.empleadoSucursalId,
    values.encuestaId,
  )

  if (existing) {
    return { error: 'ALREADY_PARTICIPATED' as const }
  }

  const participacion = await db.$transaction(async (tx) => {
    const created = await tx.participacion.create({
      data: {
        EmpleadoSucursal_Id: values.empleadoSucursalId,
        Encuesta_Id: values.encuestaId,
      },
    })

    const respuestasData = values.respuestas.flatMap((respuesta) =>
      respuesta.opcionIds.map((opcionId) => ({
        Participacion_Id: created.Id,
        Pregunta_Id: respuesta.preguntaId,
        Opcion_Id: opcionId,
      })),
    )

    await tx.respuesta.createMany({ data: respuestasData })

    return created
  })

  return { success: true, participacionId: participacion.Id }
}

export async function updateParticipacion(
  participacionId: number,
  values: ParticipationFormValues,
) {
  const participacion = await db.participacion.findUnique({
    where: { Id: participacionId },
  })

  if (!participacion) {
    return { error: 'NOT_FOUND' as const }
  }

  if (!isWithinEditWindow(participacion.DateCreated)) {
    return { error: 'EDIT_WINDOW_EXPIRED' as const }
  }

  await db.$transaction(async (tx) => {
    await tx.respuesta.deleteMany({
      where: { Participacion_Id: participacionId },
    })

    const respuestasData = values.respuestas.flatMap((respuesta) =>
      respuesta.opcionIds.map((opcionId) => ({
        Participacion_Id: participacionId,
        Pregunta_Id: respuesta.preguntaId,
        Opcion_Id: opcionId,
      })),
    )

    await tx.respuesta.createMany({ data: respuestasData })
  })

  return { success: true }
}
