export interface Contact {
  id: string
  name: string
  email: string
  phone: string | null
  company: string
  country: string
  service_required: string
  message: string
  created_at: string
}

export interface Settings {
  id: number
  email_enabled: boolean
}
