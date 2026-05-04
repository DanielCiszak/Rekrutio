import { apiClient } from './apiClient'
import type { Company } from '../types/company'

export async function getCompanies() {
  const response = await apiClient.get<Company[]>('/companies')
  return response.data
}
