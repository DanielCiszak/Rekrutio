import { apiClient } from './apiClient'
import type { Company, CreateCompanyRequest } from '../types/company'

export async function getCompanies() {
  const response = await apiClient.get<Company[]>('/companies')
  return response.data
}

export async function createCompany(request: CreateCompanyRequest) {
  const response = await apiClient.post<Company>('/companies', request)
  return response.data
}
