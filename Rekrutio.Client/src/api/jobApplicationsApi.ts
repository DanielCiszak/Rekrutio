import { apiClient } from './apiClient'
import type {
  ApplicationStatusHistory,
  CreateJobApplicationRequest,
  JobApplication,
  UpdateJobApplicationRequest,
} from '../types/jobApplication'

export async function getJobApplications() {
  const response = await apiClient.get<JobApplication[]>('/jobapplications')
  return response.data
}

export async function createJobApplication(request: CreateJobApplicationRequest) {
  const response = await apiClient.post<JobApplication>('/jobapplications', request)
  return response.data
}

export async function updateJobApplication(
  id: string,
  request: UpdateJobApplicationRequest,
) {
  await apiClient.put(`/jobapplications/${id}`, request)
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
