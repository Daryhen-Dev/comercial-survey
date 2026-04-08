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
  FormMessage,
} from '@/components/ui/form'

interface OptionEditorProps {
  nestIndex: number
  control: Control<SurveyFormValues>
  errors?: FieldErrors<SurveyFormValues>
}

export function OptionEditor({ nestIndex, control, errors }: OptionEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `preguntas.${nestIndex}.opciones`,
  })

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Opciones</p>

      {fields.map((field, oIdx) => (
        <div key={field.id} className="flex items-start gap-2">
          <FormField
            control={control}
            name={`preguntas.${nestIndex}.opciones.${oIdx}.texto`}
            render={({ field: inputField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder={`Opción ${oIdx + 1}`}
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-0 shrink-0 text-muted-foreground hover:text-destructive"
            disabled={fields.length <= 2}
            onClick={() => remove(oIdx)}
            aria-label={`Eliminar opción ${oIdx + 1}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}

      {/* Array-level error for minimum 2 options */}
      {(() => {
        const msg = (errors?.preguntas?.[nestIndex]?.opciones as { message?: string } | undefined)?.message
        return msg ? (
          <p className="text-sm font-medium text-destructive">{msg}</p>
        ) : null
      })()}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => append({ texto: '', orden: fields.length })}
      >
        <Plus className="size-3.5" />
        Agregar opción
      </Button>
    </div>
  )
}
