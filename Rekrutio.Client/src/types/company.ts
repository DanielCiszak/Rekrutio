export type Company = {
  id: string
  name: string
  websiteUrl: string | null
  location: string | null
  createdAt: string
  updatedAt: string | null
}

export type CreateCompanyRequest = {
  name: string
  websiteUrl: string | null
  location: string | null
}
