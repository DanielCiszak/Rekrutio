import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CompaniesPage } from './pages/CompaniesPage'
import { CreateCompanyPage } from './pages/CreateCompanyPage'
import { CreateJobApplicationPage } from './pages/CreateJobApplicationPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditJobApplicationPage } from './pages/EditJobApplicationPage'
import { JobApplicationDetailsPage } from './pages/JobApplicationDetailsPage'
import { JobApplicationsPage } from './pages/JobApplicationsPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/new" element={<CreateCompanyPage />} />
        <Route path="applications" element={<JobApplicationsPage />} />
        <Route path="applications/:id" element={<JobApplicationDetailsPage />} />
        <Route path="applications/:id/edit" element={<EditJobApplicationPage />} />
        <Route path="job-applications" element={<JobApplicationsPage />} />
        <Route path="job-applications/new" element={<CreateJobApplicationPage />} />
        <Route path="job-applications/:id" element={<JobApplicationDetailsPage />} />
        <Route path="job-applications/:id/edit" element={<EditJobApplicationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
