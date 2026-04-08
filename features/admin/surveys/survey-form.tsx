'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { SurveySchema, type SurveyFormValues } from '@/lib/validations/survey'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
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
import { QuestionEditor } from '@/features/admin/surveys/question-editor'

interface SurveyFormProps {
  action: (values: SurveyFormValues) => Promise<void | { error: string }>
  defaultValues?: Partial<SurveyFormValues>
  sucursales: { id: number; nombre: string }[]
}

export function SurveyForm({ action, defaultValues, sucursales }: SurveyFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(SurveySchema),
    defaultValues: {
      titulo: defaultValues?.titulo ?? '',
      descripcion: defaultValues?.descripcion ?? '',
      sucursalId: defaultValues?.sucursalId,
      preguntas: defaultValues?.preguntas ?? [
        {
          texto: '',
          tipoPregunta: 'RADIO',
          orden: 0,
          requerida: true,
          opciones: [
            { texto: '', orden: 0 },
            { texto: '', orden: 1 },
          ],
        },
      ],
    },
  })

  function onSubmit(values: SurveyFormValues) {
    startTransition(async () => {
      const result = await action(values)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Titulo */}
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input
                  placeholder="Encuesta de satisfacción Q1"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descripcion */}
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Breve descripción de la encuesta"
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sucursal */}
        <FormField
          control={form.control}
          name="sucursalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sucursal</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(parseInt(val))}
                defaultValue={field.value?.toString()}
                disabled={isPending}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccioná una sucursal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sucursales.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Questions */}
        <QuestionEditor control={form.control} errors={form.formState.errors} />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}
