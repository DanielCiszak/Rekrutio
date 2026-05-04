import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCompanies } from '../api/companiesApi'
import {
  getJobApplication,
  updateJobApplication,
} from '../api/jobApplicationsApi'
import { ErrorMessage } from '../components/ErrorMessage'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { Company } from '../types/company'
import type {
  ApplicationStatus,
  ContractType,
  JobApplication,
  WorkMode,
} from '../types/jobApplication'

export function EditJobApplicationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [application, setApplication] = useState<JobApplication | null>(null)
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
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadForm(applicationId: string) {
      try {
        const [companiesData, applicationData] = await Promise.all([
          getCompanies(),
          getJobApplication(applicationId),
        ])

        setCompanies(companiesData)
        setApplication(applicationData)
        setCompanyId(applicationData.companyId)
        setPositionTitle(applicationData.positionTitle)
        setJobAdvertUrl(applicationData.jobAdvertUrl ?? '')
        setLocation(applicationData.location ?? '')
        setSalaryMin(applicationData.salaryMin?.toString() ?? '')
        setSalaryMax(applicationData.salaryMax?.toString() ?? '')
        setContractType(applicationData.contractType)
        setWorkMode(applicationData.workMode)
        setStatus(applicationData.status)
        setNotes(applicationData.notes ?? '')
      } catch {
        setError('Could not load job application for editing.')
      } finally {
        setIsLoading(false)
      }
    }

    if (!id) {
      setError('Job application id is missing.')
      setIsLoading(false)
      return
    }

    void loadForm(id)
  }, [id])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!id) {
      setError('Job application id is missing.')
      return
    }

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
      await updateJobApplication(id, {
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
      navigate(`/applications/${id}`)
    } catch {
      setError('Could not update job application. Check the API and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading edit form..." />
  }

  if (error && !application) {
    return <ErrorMessage message={error} />
  }

  if (!application) {
    return <ErrorMessage message="Job application was not found." />
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit job application</h1>
          <p className="page-description">{application.positionTitle}</p>
        </div>
      </div>

      {companies.length === 0 ? (
        <section className="placeholder-panel">
          Add a company before editing job applications.{' '}
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
                onChange={(event) =>
                  setStatus(Number(event.target.value) as ApplicationStatus)
                }
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
                onChange={(event) =>
                  setContractType(Number(event.target.value) as ContractType)
                }
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
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </button>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => navigate(`/applications/${id}`)}
            >
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
