import { CircleAlertIcon, PackagePlusIcon, PlusIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { ServiceItemCard } from '../components/ServiceItemCard'
import { SERVICE_CATALOG } from '../config/services'
import { emptyRequestItem } from '../schema/requestConfig'
import type { WizardValues } from '../schema/wizard'

export function RequestConfigStep() {
  const { control, formState, clearErrors, trigger } = useFormContext<WizardValues>()
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = useWatch({ control, name: 'items' })

  const takenServices = useMemo(() => new Set(items.map((item) => item.service).filter(Boolean)), [items])
  const listError = formState.errors.items?.root?.message ?? formState.errors.items?.message
  const canAddMore = fields.length < SERVICE_CATALOG.length

  const addItem = () => {
    if (fields.length === 0) clearErrors('items')
    append(emptyRequestItem())
  }

  const removeItem = (index: number) => {
    remove(index)
    // Duplicate errors depend on index, revalidate after remove
    if (formState.errors.items) void trigger('items')
  }

  return (
    <div className="flex flex-col gap-4">
      {fields.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center text-muted-foreground">
          <PackagePlusIcon className="size-8" aria-hidden />
          <p className="text-sm">No services yet. Add the first one to build your request.</p>
        </div>
      )}

      {fields.map((field, index) => (
        <ServiceItemCard key={field.id} index={index} takenServices={takenServices} onRemove={() => removeItem(index)} />
      ))}

      {listError && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertDescription>{listError}</AlertDescription>
        </Alert>
      )}

      <Button type="button" variant="outline" size="lg" onClick={addItem} disabled={!canAddMore}>
        <PlusIcon />
        {canAddMore ? 'Add service' : 'All services added'}
      </Button>
    </div>
  )
}
