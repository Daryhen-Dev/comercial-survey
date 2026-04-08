'use client'

import { useTransition, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { EmployeeSchema, type EmployeeFormValues } from '@/lib/validations/employee'
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

interface EmployeeFormProps {
  action: (
    values: EmployeeFormValues & { sucursalId?: number },
  ) => Promise<void | { error: string }>
  defaultValues?: Partial<EmployeeFormValues>
  sucursales: { id: number; nombre: string }[]
  defaultSucursalId?: number
}

export function EmployeeForm({
  action,
  defaultValues,
  sucursales,
  defaultSucursalId,
}: EmployeeFormProps) {
  const [isPending, startTransition] = useTransition()
  const [sucursalId, setSucursalId] = useState<number | undefined>(defaultSucursalId)

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: {
      nombre: defaultValues?.nombre ?? '',
      apellido: defaultValues?.apellido ?? '',
      ci: defaultValues?.ci ?? '',
      estado: defaultValues?.estado ?? true,
    },
  })

  function onSubmit(values: EmployeeFormValues) {
    startTransition(async () => {
      const result = await action({ ...values, sucursalId })
      if (result && 'error' in result) {
        if (result.error === 'CI ya registrado') {
          form.setError('ci', { message: 'CI ya registrado' })
        } else {
          form.setError('root', { message: result.error })
        }
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
                <Input placeholder="Juan" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="apellido"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apellido</FormLabel>
              <FormControl>
                <Input placeholder="Pérez" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ci"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CI</FormLabel>
              <FormControl>
                <Input placeholder="12345678" disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <label
            htmlFor="sucursal-select"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Sucursal (opcional)
          </label>
          <Select
            value={sucursalId ? String(sucursalId) : undefined}
            onValueChange={(val) => setSucursalId(parseInt(val))}
            disabled={isPending}
          >
            <SelectTrigger id="sucursal-select">
              <SelectValue placeholder="Sin asignar" />
            </SelectTrigger>
            <SelectContent>
              {sucursales.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? 'Guardando...' : 'Guardar'}
        </Button>
      </form>
    </Form>
  )
}
