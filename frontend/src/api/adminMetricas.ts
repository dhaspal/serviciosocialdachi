import { apiFetch } from './client'
import type { ApiMetricasAdmin } from './types'

export function getAdminMetricas(token: string) {
  return apiFetch<ApiMetricasAdmin>('/admin/metricas', { token })
}
