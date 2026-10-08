import { Controller, useFormContext } from 'react-hook-form'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency } from '@/lib/format'

import { SERVICE_CATALOG } from '../config/services'
import type { WizardValues } from '../schema/wizard'

interface ServiceSelectFieldProps {
  index: number
  takenServices: ReadonlySet<string>
}

export function ServiceSelectField({ index, takenServices }: ServiceSelectFieldProps) {
  const { control } = useFormContext<WizardValues>()
  const id = `items-${index}-service`

  return (
    <Controller
      control={control}
      name={`items.${index}.service`}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>Service</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(value) => {
              field.onChange(value)
              field.onBlur()
            }}
          >
            <SelectTrigger
              ref={field.ref}
              id={id}
              className="h-10 w-full"
              aria-invalid={fieldState.invalid}
              onBlur={field.onBlur}
            >
              <SelectValue placeholder="Choose a service" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_CATALOG.map((service) => (
                <SelectItem
                  key={service.id}
                  value={service.id}
                  disabled={service.id !== field.value && takenServices.has(service.id)}
                >
                  {service.label} · {formatCurrency(service.unitPrice)}/{service.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
