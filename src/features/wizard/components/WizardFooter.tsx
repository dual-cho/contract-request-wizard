import { ArrowLeftIcon, ArrowRightIcon, SendIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface WizardFooterProps {
  formId: string
  isFirst: boolean
  isLast: boolean
  isSubmitting: boolean
  onBack: () => void
}

export function WizardFooter({ formId, isFirst, isLast, isSubmitting, onBack }: WizardFooterProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" size="lg" onClick={onBack} disabled={isFirst || isSubmitting}>
        <ArrowLeftIcon />
        Previous
      </Button>
      <Button type="submit" form={formId} size="lg" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner />
            Submitting…
          </>
        ) : isLast ? (
          <>
            <SendIcon />
            Submit
          </>
        ) : (
          <>
            Next
            <ArrowRightIcon />
          </>
        )}
      </Button>
    </div>
  )
}
