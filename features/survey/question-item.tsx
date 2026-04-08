'use client'

import { useState } from 'react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'

interface QuestionItemProps {
  pregunta: {
    id: number
    texto: string
    tipoPregunta: 'RADIO' | 'CHECKBOX' | 'BOTH'
    requerida: boolean
    opciones: { id: number; texto: string }[]
  }
  value: number[]
  onChange: (opcionIds: number[]) => void
  error?: string
  readOnly?: boolean
}

function RadioOptions({
  pregunta,
  value,
  onChange,
  readOnly,
}: Pick<QuestionItemProps, 'pregunta' | 'value' | 'onChange' | 'readOnly'>) {
  return (
    <RadioGroup
      value={value[0]?.toString() ?? ''}
      onValueChange={(val) => {
        if (!readOnly) onChange([parseInt(val)])
      }}
      disabled={readOnly}
      className="gap-3"
    >
      {pregunta.opciones.map((opcion) => (
        <div key={opcion.id} className="flex items-center gap-2">
          <RadioGroupItem
            value={opcion.id.toString()}
            id={`radio-${pregunta.id}-${opcion.id}`}
          />
          <Label
            htmlFor={`radio-${pregunta.id}-${opcion.id}`}
            className="font-normal cursor-pointer"
          >
            {opcion.texto}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}

function CheckboxOptions({
  pregunta,
  value,
  onChange,
  readOnly,
}: Pick<QuestionItemProps, 'pregunta' | 'value' | 'onChange' | 'readOnly'>) {
  return (
    <div className="flex flex-col gap-3">
      {pregunta.opciones.map((opcion) => {
        const checked = value.includes(opcion.id)
        return (
          <div key={opcion.id} className="flex items-center gap-2">
            <Checkbox
              id={`checkbox-${pregunta.id}-${opcion.id}`}
              checked={checked}
              disabled={readOnly}
              onCheckedChange={(isChecked) => {
                if (readOnly) return
                const next = isChecked
                  ? [...value, opcion.id]
                  : value.filter((id) => id !== opcion.id)
                onChange(next)
              }}
            />
            <Label
              htmlFor={`checkbox-${pregunta.id}-${opcion.id}`}
              className="font-normal cursor-pointer"
            >
              {opcion.texto}
            </Label>
          </div>
        )
      })}
    </div>
  )
}

export function QuestionItem({
  pregunta,
  value,
  onChange,
  error,
  readOnly = false,
}: QuestionItemProps) {
  const [mode, setMode] = useState<'radio' | 'checkbox'>('radio')

  const handleModeChange = (newMode: string) => {
    setMode(newMode as 'radio' | 'checkbox')
    onChange([])
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-medium text-foreground">
        {pregunta.texto}
        {pregunta.requerida && (
          <span className="ml-1 text-destructive" aria-label="requerida">
            *
          </span>
        )}
      </p>

      {pregunta.tipoPregunta === 'RADIO' && (
        <RadioOptions
          pregunta={pregunta}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      )}

      {pregunta.tipoPregunta === 'CHECKBOX' && (
        <CheckboxOptions
          pregunta={pregunta}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      )}

      {pregunta.tipoPregunta === 'BOTH' && (
        <Tabs
          value={mode}
          onValueChange={handleModeChange}
        >
          <TabsList className="mb-3">
            <TabsTrigger value="radio" disabled={readOnly}>
              Una opción
            </TabsTrigger>
            <TabsTrigger value="checkbox" disabled={readOnly}>
              Múltiple
            </TabsTrigger>
          </TabsList>
          <TabsContent value="radio">
            <RadioOptions
              pregunta={pregunta}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
            />
          </TabsContent>
          <TabsContent value="checkbox">
            <CheckboxOptions
              pregunta={pregunta}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
            />
          </TabsContent>
        </Tabs>
      )}

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
