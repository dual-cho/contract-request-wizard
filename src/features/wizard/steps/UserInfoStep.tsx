import { useFormContext } from 'react-hook-form'

import { FieldGroup } from '@/components/ui/field'

import { TextField } from '../components/TextField'
import { USER_INFO_FIELDS } from '../config/userInfoFields'
import type { WizardValues } from '../schema/wizard'

export function UserInfoStep() {
  const { control } = useFormContext<WizardValues>()

  return (
    <FieldGroup>
      {USER_INFO_FIELDS.map((config) => (
        <TextField key={config.name} control={control} {...config} />
      ))}
    </FieldGroup>
  )
}
