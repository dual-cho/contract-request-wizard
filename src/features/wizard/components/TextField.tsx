import type { ComponentProps } from 'react'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type NativeInputProps = Omit<ComponentProps<typeof Input>, 'name' | 'value' | 'defaultValue' | 'onChange' | 'onBlur'>

export interface TextFieldConfig<T extends FieldValues> extends NativeInputProps {
  name: FieldPath<T>
  label: string
  description?: string
}

interface TextFieldProps<T extends FieldValues> extends TextFieldConfig<T> {
  control: Control<T>
}

export function TextField<T extends FieldValues>({ control, name, label, description, ...inputProps }: TextFieldProps<T>) {
  const descriptionId = `${name}-description`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...inputProps}
            {...field}
            id={name}
            className="h-10"
            aria-invalid={fieldState.invalid}
            aria-describedby={description ? descriptionId : undefined}
          />
          {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  )
}
