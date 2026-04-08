import { z } from 'zod'

export const EmployeeSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  apellido: z.string().min(1, 'El apellido es requerido').max(100, 'Máximo 100 caracteres'),
  ci: z.string().min(1, 'El CI es requerido').max(20, 'Máximo 20 caracteres'),
  estado: z.boolean(),
})

export const AssignmentSchema = z.object({
  sucursalId: z.number({ error: 'La sucursal es requerida' }),
})

export type EmployeeFormValues = z.infer<typeof EmployeeSchema>
export type AssignmentFormValues = z.infer<typeof AssignmentSchema>
