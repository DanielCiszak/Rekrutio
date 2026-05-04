import { NavLink } from 'react-router-dom'

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-name">Rekrutio</span>
          <span className="brand-subtitle">Job application tracker</span>
        </NavLink>
        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/companies" className="nav-link">
            Companies
          </NavLink>
          <NavLink to="/job-applications" className="nav-link">
            Applications
          </NavLink>
          <NavLink to="/job-applications/new" className="nav-link">
            New application
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
