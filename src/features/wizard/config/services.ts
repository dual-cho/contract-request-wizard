export interface ServiceOption {
  id: string
  label: string
  unit: string
  unitPrice: number
}

export const SERVICE_CATALOG: readonly ServiceOption[] = [
  { id: 'consulting', label: 'Technical consulting', unit: 'hour', unitPrice: 120 },
  { id: 'integration', label: 'System integration', unit: 'module', unitPrice: 950 },
  { id: 'cloud-hosting', label: 'Managed cloud hosting', unit: 'month', unitPrice: 340 },
  { id: 'support', label: 'Priority support plan', unit: 'month', unitPrice: 210 },
  { id: 'training', label: 'On-site team training', unit: 'session', unitPrice: 600 },
  { id: 'audit', label: 'Security audit', unit: 'audit', unitPrice: 2400 },
]

const serviceIndex = new Map(SERVICE_CATALOG.map((service) => [service.id, service]))

export function findService(id: string): ServiceOption | undefined {
  return serviceIndex.get(id)
}
