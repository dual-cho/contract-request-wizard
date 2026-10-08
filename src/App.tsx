import { Toaster } from '@/components/ui/sonner'
import { RequestWizard } from '@/features/wizard/RequestWizard'

export default function App() {
  return (
    <>
      <RequestWizard />
      <Toaster position="top-center" richColors closeButton />
    </>
  )
}
