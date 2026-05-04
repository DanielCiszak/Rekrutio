import type {
  ApplicationStatus,
  ContractType,
  WorkMode,
} from '../types/jobApplication'

export function statusLabel(status: ApplicationStatus) {
  const labels: Record<ApplicationStatus, string> = {
    1: 'Planned',
    2: 'Applied',
    3: 'Screening',
    4: 'Interview',
    5: 'Offer',
    6: 'Rejected',
    7: 'Withdrawn',
    8: 'Accepted',
  }

  return labels[status] ?? 'Unknown'
}

export function contractTypeLabel(contractType: ContractType) {
  const labels: Record<ContractType, string> = {
    0: 'Unknown',
    1: 'Employment contract',
    2: 'B2B',
    3: 'Contract of mandate',
    4: 'Contract for specific work',
    5: 'Internship',
  }

  return labels[contractType] ?? 'Unknown'
}

export function workModeLabel(workMode: WorkMode) {
  const labels: Record<WorkMode, string> = {
    0: 'Unknown',
    1: 'On site',
    2: 'Hybrid',
    3: 'Remote',
  }

  return labels[workMode] ?? 'Unknown'
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function formatCurrency(value: number | null) {
  if (value === null) {
    return 'Not set'
  }

  return new Intl.NumberFormat('pl-PL', {
    maximumFractionDigits: 0,
    style: 'currency',
    currency: 'PLN',
  }).format(value)
}

export function salaryRange(salaryMin: number | null, salaryMax: number | null) {
  if (salaryMin === null && salaryMax === null) {
    return 'Not set'
  }

  if (salaryMin !== null && salaryMax !== null) {
    return `${formatCurrency(salaryMin)} - ${formatCurrency(salaryMax)}`
  }

  return formatCurrency(salaryMin ?? salaryMax)
}
