import { z } from 'zod'

export const AnswerSchema = z.object({
  preguntaId: z.number(),
  opcionIds: z.array(z.number()).min(1, 'Seleccione al menos una opción'),
})

export const ParticipationSchema = z.object({
  encuestaId: z.number(),
  empleadoSucursalId: z.number(),
  respuestas: z.array(AnswerSchema),
})

export type ParticipationFormValues = z.infer<typeof ParticipationSchema>
