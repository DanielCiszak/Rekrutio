import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  deleteJobApplication,
  getJobApplication,
  getJobApplicationStatusHistory,
} from '../api/jobApplicationsApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type {
  ApplicationStatusHistory,
  JobApplication,
} from '../types/jobApplication'
import {
  contractTypeLabel,
  formatDate,
  salaryRange,
  statusLabel,
  workModeLabel,
} from './formatters'

export function JobApplicationDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [statusHistory, setStatusHistory] = useState<ApplicationStatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDetails(applicationId: string) {
      try {
        const [applicationData, historyData] = await Promise.all([
          getJobApplication(applicationId),
          getJobApplicationStatusHistory(applicationId),
        ])
        setApplication(applicationData)
        setStatusHistory(historyData)
      } catch {
        setError('Could not load job application details.')
      } finally {
        setIsLoading(false)
      }
    }

    if (!id) {
      setError('Job application id is missing.')
      setIsLoading(false)
      return
    }

    void loadDetails(id)
  }, [id])

  async function handleDelete() {
    if (!application) {
      return
    }

    const confirmed = window.confirm(
      `Delete the application for "${application.positionTitle}" at ${application.companyName}?`,
    )

    if (!confirmed) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      await deleteJobApplication(application.id)
      navigate('/applications')
    } catch {
      setError('Could not delete job application. Check the API and try again.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading application details..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!application) {
    return <ErrorMessage message="Job application was not found." />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">{application.positionTitle}</h1>
          <p className="page-description">{application.companyName}</p>
        </div>
        <div className="form-actions">
          <Link className="button" to={`/applications/${application.id}/edit`}>
            Edit
          </Link>
          <button
            className="button button-danger"
            disabled={isDeleting}
            type="button"
            onClick={handleDelete}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link className="button button-secondary" to="/applications">
            Back to list
          </Link>
        </div>
      </div>

      <section className="grid details-grid">
        <DetailCard label="Position" value={application.positionTitle} />
        <DetailCard label="Company" value={application.companyName} />
        <DetailCard label="Status" value={statusLabel(application.status)} />
        <DetailCard label="Location" value={application.location ?? 'Not set'} />
        <DetailCard label="Job advert URL">
          {application.jobAdvertUrl ? (
            <a
              className="detail-link"
              href={application.jobAdvertUrl}
              rel="noreferrer"
              target="_blank"
            >
              {application.jobAdvertUrl}
            </a>
          ) : (
            'Not set'
          )}
        </DetailCard>
        <DetailCard label="Contract" value={contractTypeLabel(application.contractType)} />
        <DetailCard label="Work mode" value={workModeLabel(application.workMode)} />
        <DetailCard
          label="Salary"
          value={salaryRange(application.salaryMin, application.salaryMax)}
        />
        <DetailCard label="Created" value={formatDate(application.createdAt)} />
        <DetailCard
          label="Updated"
          value={application.updatedAt ? formatDate(application.updatedAt) : 'Not updated'}
        />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">Notes</h2>
        <p className="muted">{application.notes ?? 'No notes yet.'}</p>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2 className="section-title">Status history</h2>
        {statusHistory.length === 0 ? (
          <p className="empty-state">No status history yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Changed</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {statusHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{statusLabel(item.status)}</td>
                    <td>{formatDate(item.changedAt)}</td>
                    <td>{item.notes ?? <span className="muted">None</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

type DetailCardProps = {
  label: string
  value?: string
  children?: ReactNode
}

function DetailCard({ children, label, value }: DetailCardProps) {
  return (
    <article className="card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value detail-value">{children ?? value}</strong>
    </article>
  )
}
