import { PencilIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReviewSectionProps {
  title: string
  onEdit: () => void
  disabled?: boolean
  children: ReactNode
}

export function ReviewSection({ title, onEdit, disabled, children }: ReviewSectionProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardAction>
          <Button type="button" variant="ghost" size="sm" onClick={onEdit} disabled={disabled}>
            <PencilIcon />
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface ReviewRowProps {
  label: string
  value: ReactNode
}

export function ReviewRow({ label, value }: ReviewRowProps) {
  return (
    <div className="flex flex-col gap-0.5 py-1.5 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium break-all sm:text-right">{value}</dd>
    </div>
  )
}
