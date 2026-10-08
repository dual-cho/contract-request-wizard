import { FormProvider } from 'react-hook-form'

import { AppShell } from '@/components/layout/AppShell'

import { SubmissionSuccess } from './components/SubmissionSuccess'
import { WizardFooter } from './components/WizardFooter'
import { WizardStepper } from './components/WizardStepper'
import type { WizardStep } from './config/steps'
import { useRequestWizard } from './hooks/useRequestWizard'
import { RequestConfigStep } from './steps/RequestConfigStep'
import { ReviewStep } from './steps/ReviewStep'
import { UserInfoStep } from './steps/UserInfoStep'

const FORM_ID = 'contract-request-form'

const title = <h1 className="text-lg font-semibold">Contract request</h1>

export function RequestWizard() {
  const { form, navigation, isSubmitting, receipt, handleFormSubmit, startOver } = useRequestWizard()

  if (receipt) {
    return (
      <AppShell header={title}>
        <SubmissionSuccess receipt={receipt} onStartOver={startOver} />
      </AppShell>
    )
  }

  const renderStep = (id: WizardStep['id']) => {
    switch (id) {
      case 'user-info':
        return <UserInfoStep />
      case 'request':
        return <RequestConfigStep />
      case 'review':
        return <ReviewStep onEdit={navigation.goTo} disabled={isSubmitting} />
    }
  }

  return (
    <FormProvider {...form}>
      <AppShell
        scrollKey={navigation.step}
        header={
          <div className="flex flex-col gap-3">
            {title}
            <WizardStepper step={navigation.step} />
          </div>
        }
        footer={
          <WizardFooter
            formId={FORM_ID}
            isFirst={navigation.isFirst}
            isLast={navigation.isLast}
            isSubmitting={isSubmitting}
            onBack={navigation.back}
          />
        }
      >
        <form id={FORM_ID} noValidate onSubmit={handleFormSubmit} aria-label={navigation.current.title}>
          {renderStep(navigation.current.id)}
        </form>
      </AppShell>
    </FormProvider>
  )
}
