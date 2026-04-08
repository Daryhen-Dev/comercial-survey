import { z } from 'zod'

export const BranchSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(150, 'Máximo 150 caracteres'),
})

export type BranchFormValues = z.infer<typeof BranchSchema>
