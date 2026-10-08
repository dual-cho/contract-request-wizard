import { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/format'

import { ReviewRow, ReviewSection } from '../components/ReviewSection'
import { summarizeItems } from '../lib/summarize'
import type { WizardValues } from '../schema/wizard'

interface ReviewStepProps {
  onEdit: (stepIndex: number) => void
  disabled: boolean
}

export function ReviewStep({ onEdit, disabled }: ReviewStepProps) {
  const { getValues } = useFormContext<WizardValues>()
  // Snapshot so the summary matches what gets submitted
  const [snapshot] = useState(() => Object.freeze(structuredClone(getValues())))
  const { lines, total } = useMemo(() => summarizeItems(snapshot.items), [snapshot])

  return (
    <div className="flex flex-col gap-4">
      <ReviewSection title="Applicant" onEdit={() => onEdit(0)} disabled={disabled}>
        <dl className="text-sm">
          <ReviewRow label="Name" value={snapshot.fullName} />
          <ReviewRow label="Contact number" value={snapshot.phone} />
          <ReviewRow label="Email" value={snapshot.email} />
        </dl>
      </ReviewSection>

      <ReviewSection title={`Services (${lines.length})`} onEdit={() => onEdit(1)} disabled={disabled}>
        <ul className="flex flex-col gap-3 text-sm">
          {lines.map((line) => (
            <li key={line.label} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium">{line.label}</p>
                <p className="text-muted-foreground">
                  {line.quantity} × {line.unit}
                </p>
                {line.note && <p className="mt-1 break-words text-muted-foreground italic">“{line.note}”</p>}
              </div>
              <span className="shrink-0 font-medium tabular-nums">{formatCurrency(line.subtotal)}</span>
            </li>
          ))}
        </ul>
        <Separator className="my-3" />
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Estimated total</span>
          <span className="tabular-nums">{formatCurrency(total)}</span>
        </div>
      </ReviewSection>

      <p className="text-xs text-muted-foreground">
        Prices are estimates. A contract manager will confirm the final quote after submission.
      </p>
    </div>
  )
}
