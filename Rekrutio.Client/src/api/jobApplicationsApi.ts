import { apiClient } from './apiClient'
import type {
  ApplicationStatusHistory,
  JobApplication,
} from '../types/jobApplication'

export async function getJobApplications() {
  const response = await apiClient.get<JobApplication[]>('/jobapplications')
  return response.data
}

export async function getJobApplication(id: string) {
  const response = await apiClient.get<JobApplication>(`/jobapplications/${id}`)
  return response.data
}

export async function getJobApplicationStatusHistory(id: string) {
  const response = await apiClient.get<ApplicationStatusHistory[]>(
    `/jobapplications/${id}/status-history`,
  )
  return response.data
}
