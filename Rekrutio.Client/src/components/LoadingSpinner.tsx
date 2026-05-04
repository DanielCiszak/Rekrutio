type LoadingSpinnerProps = {
  label?: string
}

export function LoadingSpinner({ label = 'Loading data...' }: LoadingSpinnerProps) {
  return (
    <div className="loading" role="status">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
