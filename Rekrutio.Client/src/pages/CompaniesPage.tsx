import { useEffect, useState } from 'react'
import { getCompanies } from '../api/companiesApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { Company } from '../types/company'
import { formatDate } from './formatters'

export function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await getCompanies()
        setCompanies(data)
      } catch {
        setError('Could not load companies. Check that the API is running.')
      } finally {
        setIsLoading(false)
      }
    }

    void loadCompanies()
  }, [])

  if (isLoading) {
    return <LoadingSpinner label="Loading companies..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="page-description">Organizations connected to your applications.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Website</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>{company.name}</td>
                <td>{company.location ?? <span className="muted">Not set</span>}</td>
                <td>
                  {company.websiteUrl ? (
                    <a href={company.websiteUrl} target="_blank" rel="noreferrer">
                      {company.websiteUrl}
                    </a>
                  ) : (
                    <span className="muted">Not set</span>
                  )}
                </td>
                <td>{formatDate(company.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {companies.length === 0 && <p className="empty-state">No companies yet.</p>}
      </div>
    </>
  )
}
