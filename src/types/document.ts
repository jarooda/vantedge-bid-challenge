export const DOCUMENT_STATUSES = [
  'Draft',
  'Tayang',
  'Evaluasi',
  'Selesai',
  'Dibatalkan'
] as const

export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number]

export type Document = {
  id: string
  name: string
  agency: string
  hps: number
  deadline: string
  status: DocumentStatus
}
