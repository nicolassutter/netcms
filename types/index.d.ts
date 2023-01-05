export interface User {
  api: API
  url: string
  token: Token
  id: string
  aud: string
  role: string
  email: string
  confirmed_at: string
  confirmation_sent_at: string
  app_metadata: AppMetadata
  user_metadata: UserMetadata
  created_at: string
  updated_at: string
  _fromStorage: boolean
}

export interface API {
  apiURL: string
  _sameOrigin: boolean
  defaultHeaders: DefaultHeaders
}

export interface DefaultHeaders {}

export interface AppMetadata {
  provider: string
}

export interface Token {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  expires_at: number
}

export interface UserMetadata {
  full_name: string
}
