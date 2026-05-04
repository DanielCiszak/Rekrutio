import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
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
  const [application, setApplication] = useState<JobApplication | null>(null)
  const [statusHistory, setStatusHistory] = useState<ApplicationStatusHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
        <DetailCard label="Job advert URL" value={application.jobAdvertUrl ?? 'Not set'} />
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
  value: string
}

function DetailCard({ label, value }: DetailCardProps) {
  return (
    <article className="card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </article>
  )
}
