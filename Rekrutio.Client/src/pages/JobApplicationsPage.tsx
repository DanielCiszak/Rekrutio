import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getJobApplications } from '../api/jobApplicationsApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { JobApplication } from '../types/jobApplication'
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

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getJobApplications()
        setApplications(data)
      } catch {
        setError('Could not load job applications. Check that the API is running.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadApplications()
  }, [])

  if (isLoading) {
    return <LoadingSpinner label="Loading applications..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
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
