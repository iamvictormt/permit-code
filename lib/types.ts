export type VerificationLevel = "LOW" | "MEDIUM" | "HIGH"
export type AccountStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED"
export type DocumentType = "PASSPORT" | "ID_CARD" | "EMPLOYEE_CARD"
export type StatusType = "EMPLOYEE" | "VISITOR" | "CONTRACTOR"
export type Situation = "VALID" | "EXPIRED" | "REVOKED"

export interface User {
  id: string
  full_name: string
  email: string
  verification_level: VerificationLevel
  account_status: AccountStatus
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  user_id: string
  type: DocumentType
  number: string
  verified: boolean
  verified_at: string | null
}

export interface UserStatus {
  id: string
  user_id: string
  status_type: StatusType
  start_date: string
  end_date: string | null
  situation: Situation
}

export interface ShareCode {
  code: string
  user_id: string
  expires_at: string
  purpose: string | null
}

export interface UserWithDetails extends User {
  documents: Document[]
  statuses: UserStatus[]
  share_codes: ShareCode[]
}
