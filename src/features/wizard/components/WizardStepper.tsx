import { Progress } from '@/components/ui/progress'

import { WIZARD_STEPS } from '../config/steps'

interface WizardStepperProps {
  step: number
}

export function WizardStepper({ step }: WizardStepperProps) {
  const current = WIZARD_STEPS[step]
  const progress = ((step + 1) / WIZARD_STEPS.length) * 100

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2 text-sm">
        <h2 className="font-medium">{current.title}</h2>
        <span className="shrink-0 text-muted-foreground tabular-nums" aria-live="polite">
          Step {step + 1} of {WIZARD_STEPS.length}
        </span>
      </div>
      <Progress value={progress} aria-label={`Step ${step + 1} of ${WIZARD_STEPS.length}`} />
      <p className="text-sm text-muted-foreground">{current.description}</p>
    </div>
  )
}
