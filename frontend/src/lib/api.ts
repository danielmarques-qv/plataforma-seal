import { getAuthToken } from './supabase'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const token = await getAuthToken()
  
  if (!token) {
    throw new Error('Não autenticado')
  }

  const { method = 'GET', body } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Erro desconhecido' }))
    throw new Error(error.detail || `Erro ${response.status}`)
  }

  return response.json()
}

// Profile API
export const profileApi = {
  getMe: () => apiRequest<Profile>('/profiles/me'),
  updateMe: (data: Partial<Profile>) => apiRequest<Profile>('/profiles/me', { method: 'PUT', body: data }),
  completeStep0: (data: OnboardingStep0Data) => apiRequest<Profile>('/profiles/onboarding/complete-step-0', { method: 'POST', body: data }),
  completeStep1: () => apiRequest<Profile>('/profiles/onboarding/complete-step-1', { method: 'POST' }),
  completeStep2: () => apiRequest<Profile>('/profiles/onboarding/complete-step-2', { method: 'POST' }),
  getDashboardStats: () => apiRequest<DashboardStats>('/profiles/dashboard-stats'),
}

// CRM API
export const crmApi = {
  getBoard: () => apiRequest<KanbanBoard>('/crm/board'),
  getLeads: (status?: string) => apiRequest<Lead[]>(`/crm/leads${status ? `?status=${status}` : ''}`),
  createLead: (data: CreateLeadData) => apiRequest<Lead>('/crm/leads', { method: 'POST', body: data }),
  updateLead: (id: number, data: Partial<Lead>) => apiRequest<Lead>(`/crm/leads/${id}`, { method: 'PUT', body: data }),
  moveLead: (id: number, status: string) => apiRequest<Lead>(`/crm/leads/${id}/move`, { method: 'PATCH', body: { status } }),
  deleteLead: (id: number) => apiRequest<void>(`/crm/leads/${id}`, { method: 'DELETE' }),
}

// Training API
export const trainingApi = {
  getOverview: () => apiRequest<TrainingOverview>('/training/modules'),
  getModule: (id: number) => apiRequest<TrainingModule>(`/training/modules/${id}`),
  completeModule: (id: number) => apiRequest<void>(`/training/modules/${id}/complete`, { method: 'POST' }),
  getPending: () => apiRequest<TrainingModule[]>('/training/pending'),
}

// Resources API
export const resourcesApi = {
  getArsenal: () => apiRequest<Arsenal>('/resources/arsenal'),
  getList: (category?: string) => apiRequest<Resource[]>(`/resources/list${category ? `?category=${category}` : ''}`),
  download: (id: number) => apiRequest<{ file_url: string }>(`/resources/${id}/download`, { method: 'POST' }),
}

// Commissions API
export const commissionsApi = {
  getSummary: () => apiRequest<CommissionSummary>('/commissions/summary'),
  getRules: () => apiRequest<CommissionRules>('/commissions/rules'),
  getList: (status?: string) => apiRequest<Commission[]>(`/commissions/list${status ? `?status=${status}` : ''}`),
}

// Onboarding API
export const onboardingApi = {
  checkSchedule: () => apiRequest<ScheduleCheck>('/onboarding/check-schedule'),
  confirmSchedule: () => apiRequest<{ status: string; message: string }>('/onboarding/confirm-schedule', { method: 'POST' }),
  // DEV ONLY - simula agendamento
  devSimulateSchedule: () => apiRequest<{ status: string; message: string }>('/onboarding/dev-simulate-schedule', { method: 'POST' }),
}

export interface ScheduleCheck {
  has_schedule: boolean
  schedule_time: string | null
}

// Types
export interface Profile {
  id: string
  onboarding_step: number
  email: string | null
  full_name: string | null
  phone: string | null
  pix_key: string | null
  financial_goal: number
  current_commission: number
  families_saved_count: number
  heptagram_scores: Record<string, number>
  dream_description: string | null
  progress_percentage: number
}

export interface OnboardingStep0Data {
  full_name: string
  phone: string
  pix_key: string
  financial_goal: number
  dream_description?: string
  heptagram_scores: Record<string, number>
}

export interface DashboardStats {
  operador: string
  familias_salvas: number
  comissao_atual: number
  meta_financeira: number
  progresso_percentual: number
  onboarding_step: number
  heptagram_scores: Record<string, number>
}

export interface Lead {
  id: number
  strategist_id: string
  status: 'RADAR' | 'COMBATE' | 'EXTRAÇÃO' | 'RESGATE'
  name: string
  phone: string | null
  email: string | null
  potential_value: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface CreateLeadData {
  name: string
  phone?: string
  email?: string
  potential_value?: number
  notes?: string
  status?: string
}

export interface KanbanBoard {
  RADAR: Lead[]
  COMBATE: Lead[]
  EXTRAÇÃO: Lead[]
  RESGATE: Lead[]
  total_count: number
  families_saved: number
}

export interface TrainingModule {
  id: number
  title: string
  description: string | null
  video_url: string | null
  thumbnail_url: string | null
  order_index: number
  required_step: number
  duration_minutes: number
  is_completed: boolean
  completed_at: string | null
  is_locked: boolean
}

export interface TrainingOverview {
  total_modules: number
  completed_modules: number
  available_modules: number
  locked_modules: number
  progress_percentage: number
  modules: TrainingModule[]
}

export interface Resource {
  id: number
  title: string
  description: string | null
  category: string
  file_url: string
  thumbnail_url: string | null
  file_type: string | null
  order_index: number
  download_count: number
}

export interface Arsenal {
  SCRIPT: Resource[]
  PLAYBOOK: Resource[]
  TEMPLATE: Resource[]
  GUIDE: Resource[]
  total_count: number
}

export interface Commission {
  id: number
  strategist_id: string
  lead_id: number | null
  amount: number
  status: string
  description: string | null
  paid_at: string | null
  created_at: string
}

export interface CommissionSummary {
  total_earned: number
  total_pending: number
  total_paid: number
  pending_count: number
  paid_count: number
  commissions: Commission[]
}

export interface CommissionRules {
  title: string
  description: string
  tiers: {
    tier: number
    name: string
    min_sales: number
    max_sales: number | null
    commission_rate: number
    bonus: string | null
  }[]
}
