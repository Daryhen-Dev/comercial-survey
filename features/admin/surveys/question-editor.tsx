'use client'

import { useFieldArray, type Control, type FieldErrors } from 'react-hook-form'
import { Plus, Trash2 } from 'lucide-react'

import type { SurveyFormValues } from '@/lib/validations/survey'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OptionEditor } from '@/features/admin/surveys/option-editor'
import { Separator } from '@/components/ui/separator'

interface QuestionEditorProps {
  control: Control<SurveyFormValues>
  errors: FieldErrors<SurveyFormValues>
}

const TIPO_PREGUNTA_LABELS = {
  RADIO: 'Opción única',
  CHECKBOX: 'Selección múltiple',
  BOTH: 'Ambos',
} as const

export function QuestionEditor({ control, errors }: QuestionEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'preguntas',
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold text-foreground">Preguntas</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={() =>
            append({
              texto: '',
              tipoPregunta: 'RADIO',
              orden: fields.length,
              requerida: true,
              opciones: [
                { texto: '', orden: 0 },
                { texto: '', orden: 1 },
              ],
            })
          }
        >
          <Plus className="size-3.5" />
          Agregar pregunta
        </Button>
      </div>

      {/* Root-level error for minimum 1 question */}
      {errors.preguntas?.root?.message && (
        <p className="text-sm text-destructive">{errors.preguntas.root.message}</p>
      )}
      {typeof errors.preguntas?.message === 'string' && (
        <p className="text-sm text-destructive">{errors.preguntas.message}</p>
      )}

      {fields.map((field, pIdx) => (
        <div
          key={field.id}
          className="rounded-lg border bg-card p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Pregunta {pIdx + 1}
            </p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              disabled={fields.length <= 1}
              onClick={() => remove(pIdx)}
              aria-label={`Eliminar pregunta ${pIdx + 1}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          {/* Texto */}
          <FormField
            control={control}
            name={`preguntas.${pIdx}.texto`}
            render={({ field: inputField }) => (
              <FormItem>
                <FormLabel>Texto de la pregunta</FormLabel>
                <FormControl>
                  <Input
                    placeholder="¿Cómo calificarías el servicio?"
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-wrap gap-4">
            {/* Tipo Pregunta */}
            <FormField
              control={control}
              name={`preguntas.${pIdx}.tipoPregunta`}
              render={({ field: selectField }) => (
                <FormItem className="flex-1 min-w-[180px]">
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    onValueChange={selectField.onChange}
                    defaultValue={selectField.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(Object.entries(TIPO_PREGUNTA_LABELS) as [keyof typeof TIPO_PREGUNTA_LABELS, string][]).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Requerida */}
            <FormField
              control={control}
              name={`preguntas.${pIdx}.requerida`}
              render={({ field: checkField }) => (
                <FormItem className="flex flex-col justify-end pb-1">
                  <FormLabel className="mb-2">Requerida</FormLabel>
                  <FormControl>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="size-4 accent-primary"
                        checked={checkField.value}
                        onChange={checkField.onChange}
                      />
                      <span className="text-muted-foreground">
                        {checkField.value ? 'Sí' : 'No'}
                      </span>
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          {/* Options */}
          <OptionEditor nestIndex={pIdx} control={control} errors={errors} />
        </div>
      ))}
    </div>
  )
}
