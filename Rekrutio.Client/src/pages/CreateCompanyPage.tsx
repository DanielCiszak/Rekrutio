import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCompany } from '../api/companiesApi'
import { ErrorMessage } from '../components/ErrorMessage'

export function CreateCompanyPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Company name is required.')
      return
    }

    setIsSubmitting(true)

    try {
      await createCompany({
        name: name.trim(),
        websiteUrl: normalizeOptionalText(websiteUrl),
        location: normalizeOptionalText(location),
      })
      navigate('/companies')
    } catch {
      setError('Could not create company. Check the API and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create company</h1>
          <p className="page-description">Add an organization before tracking applications.</p>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error && <ErrorMessage message={error} />}

        <label className="form-field">
          <span>Name</span>
          <input
            maxLength={200}
            required
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Website URL</span>
          <input
            maxLength={500}
            type="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
          />
        </label>

        <label className="form-field">
          <span>Location</span>
          <input
            maxLength={200}
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>

        <div className="form-actions">
          <button className="button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating...' : 'Create company'}
          </button>
          <button className="button button-secondary" type="button" onClick={() => navigate('/companies')}>
            Cancel
          </button>
        </div>
      </form>
    </>
  )
}

function normalizeOptionalText(value: string) {
  return value.trim() === '' ? null : value.trim()
}
