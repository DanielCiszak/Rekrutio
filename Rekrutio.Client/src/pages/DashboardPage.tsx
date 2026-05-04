import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary } from '../api/dashboardApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { DashboardSummary } from '../types/dashboard'
import { formatCurrency, formatDate, statusLabel } from './formatters'

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await getDashboardSummary()
        setSummary(data)
      } catch {
        setError('Could not load dashboard summary. Check that the API is running.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadSummary()
  }, [])

  if (isLoading) {
    return <LoadingSpinner label="Loading dashboard..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!summary) {
    return <ErrorMessage message="Dashboard data is unavailable." />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">A quick view of your recruitment pipeline.</p>
        </div>
      </div>

      <section className="grid stats-grid">
        <StatCard label="Applications" value={summary.totalApplications} />
        <StatCard label="Companies" value={summary.totalCompanies} />
        <StatCard label="Planned" value={summary.plannedCount} />
        <StatCard label="Applied" value={summary.appliedCount} />
        <StatCard label="Interviews" value={summary.interviewCount} />
        <StatCard label="Offers" value={summary.offerCount} />
        <StatCard label="Rejected" value={summary.rejectedCount} />
        <StatCard label="Avg. salary min" value={formatCurrency(summary.averageSalaryMin)} />
        <StatCard label="Avg. salary max" value={formatCurrency(summary.averageSalaryMax)} />
      </section>

      <section className="card">
        <h2 className="section-title">Latest applications</h2>
        {summary.latestApplications.length === 0 ? (
          <p className="empty-state">No job applications yet.</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Position</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {summary.latestApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <Link to={`/applications/${application.id}`}>
                        {application.positionTitle}
                      </Link>
                    </td>
                    <td>{application.companyName}</td>
                    <td>
                      <span className="status-pill">{statusLabel(application.status)}</span>
                    </td>
                    <td>{formatDate(application.createdAt)}</td>
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

type StatCardProps = {
  label: string
  value: number | string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <article className="card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
    </article>
  )
}
