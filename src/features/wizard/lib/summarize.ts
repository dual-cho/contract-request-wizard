import { findService } from '../config/services'
import type { RequestItem } from '../schema/requestConfig'

export interface SummaryLine {
  label: string
  unit: string
  quantity: number
  note: string
  subtotal: number
}

export function summarizeItems(items: readonly RequestItem[]) {
  const lines: SummaryLine[] = items.map((item) => {
    const service = findService(item.service)
    const unitPrice = service?.unitPrice ?? 0
    return {
      label: service?.label ?? item.service,
      unit: service?.unit ?? 'unit',
      quantity: item.quantity,
      note: item.note.trim(),
      subtotal: unitPrice * item.quantity,
    }
  })
  const total = lines.reduce((sum, line) => sum + line.subtotal, 0)
  return { lines, total }
}
