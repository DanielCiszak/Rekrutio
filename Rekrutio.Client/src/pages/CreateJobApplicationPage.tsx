import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCompanies } from '../api/companiesApi'
import { createJobApplication } from '../api/jobApplicationsApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { Company } from '../types/company'
import type {
  ApplicationStatus,
  ContractType,
  WorkMode,
} from '../types/jobApplication'

export function CreateJobApplicationPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [companyId, setCompanyId] = useState('')
  const [positionTitle, setPositionTitle] = useState('')
  const [jobAdvertUrl, setJobAdvertUrl] = useState('')
  const [location, setLocation] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [contractType, setContractType] = useState<ContractType>(0)
  const [workMode, setWorkMode] = useState<WorkMode>(0)
  const [status, setStatus] = useState<ApplicationStatus>(1)
  const [notes, setNotes] = useState('')
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCompanies() {
      try {
        const data = await getCompanies()
        setCompanies(data)
        setCompanyId(data[0]?.id ?? '')
      } catch {
        setError('Could not load companies. Create a company first or check the API.')
      } finally {
        setIsLoadingCompanies(false)
      }
    }

    void loadCompanies()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!companyId) {
      setError('Company is required.')
      return
    }

    if (!positionTitle.trim()) {
      setError('Position title is required.')
      return
    }

    const parsedSalaryMin = parseOptionalNumber(salaryMin)
    const parsedSalaryMax = parseOptionalNumber(salaryMax)

    if (
      parsedSalaryMin !== null &&
      parsedSalaryMax !== null &&
      parsedSalaryMin > parsedSalaryMax
    ) {
      setError('Salary min cannot be greater than salary max.')
      return
    }

    setIsSubmitting(true)

    try {
      await createJobApplication({
        companyId,
        positionTitle: positionTitle.trim(),
        jobAdvertUrl: normalizeOptionalText(jobAdvertUrl),
        location: normalizeOptionalText(location),
        salaryMin: parsedSalaryMin,
        salaryMax: parsedSalaryMax,
        contractType,
        workMode,
        status,
        notes: normalizeOptionalText(notes),
      })
      navigate('/applications')
    } catch {
      setError('Could not create job application. Check the API and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingCompanies) {
    return <LoadingSpinner label="Loading companies..." />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create job application</h1>
          <p className="page-description">Track a new role in your recruitment pipeline.</p>
        </div>
      </div>

      {companies.length === 0 ? (
        <section className="placeholder-panel">
          Add a company before creating a job application.{' '}
          <Link to="/companies/new">Create company</Link>
        </section>
      ) : (
        <form className="form-card" onSubmit={handleSubmit}>
          {error && <ErrorMessage message={error} />}

          <label className="form-field">
            <span>Company</span>
            <select
              required
              value={companyId}
              onChange={(event) => setCompanyId(event.target.value)}
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Position title</span>
            <input
              maxLength={200}
              required
              type="text"
              value={positionTitle}
              onChange={(event) => setPositionTitle(event.target.value)}
            />
          </label>

          <label className="form-field">
            <span>Job advert URL</span>
            <input
              maxLength={1000}
              type="url"
              value={jobAdvertUrl}
              onChange={(event) => setJobAdvertUrl(event.target.value)}
            />
          </label>

          <div className="form-grid">
            <label className="form-field">
              <span>Location</span>
              <input
                maxLength={200}
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(Number(event.target.value) as ApplicationStatus)}
              >
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
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>Contract type</span>
              <select
                value={contractType}
                onChange={(event) => setContractType(Number(event.target.value) as ContractType)}
              >
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
              <select
                value={workMode}
                onChange={(event) => setWorkMode(Number(event.target.value) as WorkMode)}
              >
                <option value={0}>Unknown</option>
                <option value={1}>On site</option>
                <option value={2}>Hybrid</option>
                <option value={3}>Remote</option>
              </select>
            </label>
          </div>

          <div className="form-grid">
            <label className="form-field">
              <span>Salary min</span>
              <input
                min={0}
                type="number"
                value={salaryMin}
                onChange={(event) => setSalaryMin(event.target.value)}
              />
            </label>

            <label className="form-field">
              <span>Salary max</span>
              <input
                min={0}
                type="number"
                value={salaryMax}
                onChange={(event) => setSalaryMax(event.target.value)}
              />
            </label>
          </div>

          <label className="form-field">
            <span>Notes</span>
            <textarea
              maxLength={2000}
              rows={5}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </label>

          <div className="form-actions">
            <button className="button" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Creating...' : 'Create application'}
            </button>
            <button className="button button-secondary" type="button" onClick={() => navigate('/applications')}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </>
  )
}

function normalizeOptionalText(value: string) {
  return value.trim() === '' ? null : value.trim()
}

function parseOptionalNumber(value: string) {
  return value.trim() === '' ? null : Number(value)
}
