import type { TextFieldConfig } from '../components/TextField'
import type { WizardValues } from '../schema/wizard'

export const USER_INFO_FIELDS: readonly TextFieldConfig<WizardValues>[] = [
  {
    name: 'fullName',
    label: 'Full name',
    placeholder: 'Jane Doe',
    autoComplete: 'name',
    autoCapitalize: 'words',
    enterKeyHint: 'next',
  },
  {
    name: 'phone',
    label: 'Contact number',
    type: 'tel',
    inputMode: 'tel',
    placeholder: '+1 555 123 4567',
    autoComplete: 'tel',
    enterKeyHint: 'next',
    description: 'Include your country code if you are outside the US.',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    inputMode: 'email',
    placeholder: 'jane@company.com',
    autoComplete: 'email',
    autoCapitalize: 'none',
    spellCheck: false,
    enterKeyHint: 'next',
  },
]
