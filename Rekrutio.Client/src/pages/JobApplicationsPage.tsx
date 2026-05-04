import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobApplications } from '../api/jobApplicationsApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type {
  ApplicationStatus,
  ContractType,
  JobApplication,
  JobApplicationFilters,
  WorkMode,
} from '../types/jobApplication'
import {
  contractTypeLabel,
  formatDate,
  salaryRange,
  statusLabel,
  workModeLabel,
} from './formatters'

export function JobApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('')
  const [contractType, setContractType] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    void loadApplications()
  }, [])

  async function loadApplications(filters: JobApplicationFilters = {}) {
    setIsLoading(true)
    setError(null)

    try {
      const data = await getJobApplications(filters)
      setApplications(data)
    } catch {
      setError('Could not load job applications. Check that the API is running.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleApplyFilters() {
    void loadApplications(buildFilters())
  }

  function handleClearFilters() {
    setSearchTerm('')
    setStatus('')
    setContractType('')
    setWorkMode('')
    setLocation('')
    void loadApplications()
  }

  function buildFilters(): JobApplicationFilters {
    return {
      searchTerm: normalizeFilterText(searchTerm),
      location: normalizeFilterText(location),
      status: status ? (Number(status) as ApplicationStatus) : undefined,
      contractType: contractType ? (Number(contractType) as ContractType) : undefined,
      workMode: workMode ? (Number(workMode) as WorkMode) : undefined,
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading applications..." />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Job applications</h1>
          <p className="page-description">Track roles, companies, status, and compensation.</p>
        </div>
        <Link className="button" to="/job-applications/new">
          New application
        </Link>
      </div>

      <section className="filter-panel">
        <label className="form-field">
          <span>Search</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Position, company, location, notes"
          />
        </label>

        <label className="form-field">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All statuses</option>
            <option value={1}>Planned</option>
            <option value={2}>Applied</option>
            <option value={3}>Screening</option>
            <option value={4}>Interview</option>
            <option value={5}>Offer</option>
            <option value={6}>Rejected</option>
            <option value={7}>Withdrawn</option>
            <option value={8}>Accepted</option>
          </select>
        </label>

        <label className="form-field">
          <span>Contract</span>
          <select
            value={contractType}
            onChange={(event) => setContractType(event.target.value)}
          >
            <option value="">All contracts</option>
            <option value={0}>Unknown</option>
            <option value={1}>Employment contract</option>
            <option value={2}>B2B</option>
            <option value={3}>Contract of mandate</option>
            <option value={4}>Contract for specific work</option>
            <option value={5}>Internship</option>
          </select>
        </label>

        <label className="form-field">
          <span>Work mode</span>
          <select value={workMode} onChange={(event) => setWorkMode(event.target.value)}>
            <option value="">All modes</option>
            <option value={0}>Unknown</option>
            <option value={1}>On site</option>
            <option value={2}>Hybrid</option>
            <option value={3}>Remote</option>
          </select>
        </label>

        <label className="form-field">
          <span>Location</span>
          <input
            type="search"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City or region"
          />
        </label>

        <div className="filter-actions">
          <button className="button" type="button" onClick={handleApplyFilters}>
            Apply filters
          </button>
          <button className="button button-secondary" type="button" onClick={handleClearFilters}>
            Clear filters
          </button>
        </div>
      </section>

      {error && <ErrorMessage message={error} />}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Company</th>
              <th>Status</th>
              <th>Location</th>
              <th>Contract</th>
              <th>Work mode</th>
              <th>Salary</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr className="clickable-row" key={application.id}>
                <td>
                  <Link to={`/applications/${application.id}`}>
                    {application.positionTitle}
                  </Link>
                </td>
                <td>{application.companyName}</td>
                <td>
                  <span className="status-pill">{statusLabel(application.status)}</span>
                </td>
                <td>{application.location ?? <span className="muted">Not set</span>}</td>
                <td>{contractTypeLabel(application.contractType)}</td>
                <td>{workModeLabel(application.workMode)}</td>
                <td>{salaryRange(application.salaryMin, application.salaryMax)}</td>
                <td>{formatDate(application.createdAt)}</td>
                <td>
                  <Link className="text-link" to={`/applications/${application.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p className="empty-state">No job applications yet.</p>}
      </div>
    </>
  )
}

function normalizeFilterText(value: string) {
  const trimmedValue = value.trim()
  return trimmedValue === '' ? undefined : trimmedValue
}
