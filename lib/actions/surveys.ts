'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import type { SurveyFormValues } from '@/lib/validations/survey'

export async function createEncuesta(values: SurveyFormValues) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.encuesta.create({
      data: {
        Titulo: values.titulo,
        Descripcion: values.descripcion ?? null,
        Sucursal_Id: values.sucursalId,
        Preguntas: {
          create: values.preguntas.map((pregunta, pIdx) => ({
            Texto: pregunta.texto,
            Tipo: pregunta.tipoPregunta,
            Orden: pregunta.orden ?? pIdx,
            Requerida: pregunta.requerida,
            Opciones: {
              create: pregunta.opciones.map((opcion, oIdx) => ({
                Texto: opcion.texto,
                Orden: opcion.orden ?? oIdx,
              })),
            },
          })),
        },
      },
    })
    revalidatePath('/admin/surveys')
  } catch {
    return { error: 'Error al crear la encuesta' }
  }

  redirect('/admin/surveys')
}

export async function updateEncuesta(id: number, values: SurveyFormValues) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.$transaction(async (tx) => {
      // Delete existing preguntas (cascades to Opciones via onDelete: Cascade)
      await tx.pregunta.deleteMany({
        where: { Encuesta_Id: id },
      })

      // Update encuesta fields
      await tx.encuesta.update({
        where: { Id: id },
        data: {
          Titulo: values.titulo,
          Descripcion: values.descripcion ?? null,
          Sucursal_Id: values.sucursalId,
        },
      })

      // Create new preguntas with opciones
      for (let pIdx = 0; pIdx < values.preguntas.length; pIdx++) {
        const pregunta = values.preguntas[pIdx]
        await tx.pregunta.create({
          data: {
            Encuesta_Id: id,
            Texto: pregunta.texto,
            Tipo: pregunta.tipoPregunta,
            Orden: pregunta.orden ?? pIdx,
            Requerida: pregunta.requerida,
            Opciones: {
              create: pregunta.opciones.map((opcion, oIdx) => ({
                Texto: opcion.texto,
                Orden: opcion.orden ?? oIdx,
              })),
            },
          },
        })
      }
    })

    revalidatePath('/admin/surveys')
    revalidatePath(`/admin/surveys/${id}/edit`)
  } catch {
    return { error: 'Error al actualizar la encuesta' }
  }

  redirect('/admin/surveys')
}

export async function toggleEncuestaEstado(id: number, activa: boolean) {
  const session = await auth()
  if (!session) return { error: 'Unauthorized' }

  try {
    await db.encuesta.update({
      where: { Id: id },
      data: { Activa: !activa },
    })
    revalidatePath('/admin/surveys')
    return { success: true }
  } catch {
    return { error: 'Error al actualizar el estado de la encuesta' }
  }
}
