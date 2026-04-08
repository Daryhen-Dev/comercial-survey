'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { BranchSchema, type BranchFormValues } from '@/lib/validations/branch'
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

interface BranchFormProps {
  action: (values: BranchFormValues) => Promise<void | { error: string }>
  defaultValues?: Partial<BranchFormValues>
}

export function BranchForm({ action, defaultValues }: BranchFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<BranchFormValues>({
    resolver: zodResolver(BranchSchema),
    defaultValues: { nombre: defaultValues?.nombre ?? '' },
  })

  function onSubmit(values: BranchFormValues) {
    startTransition(async () => {
      const result = await action(values)
      if (result && 'error' in result) {
        form.setError('root', { message: result.error })
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && (
          <div
            role="alert"
            className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {form.formState.errors.root.message}
          </div>
        )}

        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Sucursal Centro" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}
