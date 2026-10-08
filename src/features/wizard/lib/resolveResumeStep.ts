import { WIZARD_STEPS } from '../config/steps'
import type { WizardValues } from '../schema/wizard'

// Saved step might be past an invalid one (e.g. schema changed), resume at the first failing step
export function resolveResumeStep(values: WizardValues, savedStep: number): number {
  for (let index = 0; index < savedStep; index++) {
    const schema = WIZARD_STEPS[index]?.schema
    if (schema && !schema.safeParse(values).success) return index
  }
  return savedStep
}
