import { z } from 'zod'

export const OptionSchema = z.object({
  texto: z.string().min(1, 'La opción es requerida').max(300),
  orden: z.number().optional().default(0),
})

export const QuestionSchema = z.object({
  texto: z.string().min(1, 'La pregunta es requerida').max(500),
  tipoPregunta: z.enum(['RADIO', 'CHECKBOX', 'BOTH']),
  orden: z.number().optional().default(0),
  requerida: z.boolean().default(true),
  opciones: z.array(OptionSchema).min(2, 'Mínimo 2 opciones por pregunta'),
})

export const SurveySchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200),
  descripcion: z.string().optional(),
  sucursalId: z.number({ required_error: 'Seleccione una sucursal' }),
  preguntas: z.array(QuestionSchema).min(1, 'Mínimo 1 pregunta por encuesta'),
})

export type OptionFormValues = z.infer<typeof OptionSchema>
export type QuestionFormValues = z.infer<typeof QuestionSchema>
export type SurveyFormValues = z.infer<typeof SurveySchema>
