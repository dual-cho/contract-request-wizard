import { CircleCheckIcon, RotateCcwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import type { SubmissionReceipt } from '../lib/submitRequest'

interface SubmissionSuccessProps {
  receipt: SubmissionReceipt
  onStartOver: () => void
}

export function SubmissionSuccess({ receipt, onStartOver }: SubmissionSuccessProps) {
  return (
    <Card className="text-center">
      <CardHeader className="justify-items-center">
        <CircleCheckIcon className="size-10 text-primary" aria-hidden />
        <CardTitle className="text-lg">Request submitted</CardTitle>
        <CardDescription>We will review your request and get back to you within one business day.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        <span className="text-muted-foreground">Reference number</span>
        <span className="font-mono text-base font-semibold">{receipt.referenceId}</span>
        <span className="text-muted-foreground">{receipt.submittedAt.toLocaleString()}</span>
      </CardContent>
      <CardFooter className="justify-center">
        <Button size="lg" onClick={onStartOver}>
          <RotateCcwIcon />
          Start a new request
        </Button>
      </CardFooter>
    </Card>
  )
}
