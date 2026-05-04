import type { ApplicationStatus } from './jobApplication'

export type DashboardLatestApplication = {
  id: string
  companyName: string
  positionTitle: string
  status: ApplicationStatus
  createdAt: string
}

export type DashboardSummary = {
  totalApplications: number
  plannedCount: number
  appliedCount: number
  interviewCount: number
  offerCount: number
  rejectedCount: number
  totalCompanies: number
  averageSalaryMin: number | null
  averageSalaryMax: number | null
  latestApplications: DashboardLatestApplication[]
}
