export type ApplicationStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type ContractType = 0 | 1 | 2 | 3 | 4 | 5

export type WorkMode = 0 | 1 | 2 | 3

export type JobApplication = {
  id: string
  companyId: string
  companyName: string
  positionTitle: string
  jobAdvertUrl: string | null
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  contractType: ContractType
  workMode: WorkMode
  status: ApplicationStatus
  appliedAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string | null
}

export type CreateJobApplicationRequest = {
  companyId: string
  positionTitle: string
  jobAdvertUrl: string | null
  location: string | null
  salaryMin: number | null
  salaryMax: number | null
  contractType: ContractType
  workMode: WorkMode
  status: ApplicationStatus
  notes: string | null
}

export type ApplicationStatusHistory = {
  id: string
  jobApplicationId: string
  status: ApplicationStatus
  changedAt: string
  notes: string | null
}
