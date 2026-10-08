import { Trash2Icon } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { MAX_NOTE_LENGTH, MAX_QUANTITY } from '../schema/requestConfig'
import type { WizardValues } from '../schema/wizard'
import { ServiceSelectField } from './ServiceSelectField'

interface ServiceItemCardProps {
  index: number
  takenServices: ReadonlySet<string>
  onRemove: () => void
}

export function ServiceItemCard({ index, takenServices, onRemove }: ServiceItemCardProps) {
  const { control } = useFormContext<WizardValues>()
  const quantityId = `items-${index}-quantity`
  const noteId = `items-${index}-note`

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>Service {index + 1}</CardTitle>
        <CardAction>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label={`Remove service ${index + 1}`}>
            <Trash2Icon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-4">
          <ServiceSelectField index={index} takenServices={takenServices} />

          <Controller
            control={control}
            name={`items.${index}.quantity`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={quantityId}>Quantity</FieldLabel>
                <Input
                  ref={field.ref}
                  id={quantityId}
                  name={field.name}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={MAX_QUANTITY}
                  className="h-10"
                  value={Number.isFinite(field.value) ? field.value : ''}
                  onChange={(event) => {
                    const quantity = event.target.valueAsNumber
                    field.onChange(Number.isNaN(quantity) ? undefined : quantity)
                  }}
                  onBlur={field.onBlur}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Controller
            control={control}
            name={`items.${index}.note`}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={noteId}>Notes (optional)</FieldLabel>
                <Textarea
                  {...field}
                  id={noteId}
                  rows={2}
                  placeholder="Scope, schedule or location"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  {field.value.length}/{MAX_NOTE_LENGTH} characters
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
