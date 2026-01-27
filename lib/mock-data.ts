import type {
  User,
  Document,
  UserStatus,
  ShareCode,
  UserWithDetails,
} from "./types"

export const mockUsers: User[] = [
  {
    id: "1",
    full_name: "João Silva",
    email: "joao.silva@empresa.com",
    verification_level: "HIGH",
    account_status: "ACTIVE",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    full_name: "Maria Santos",
    email: "maria.santos@empresa.com",
    verification_level: "MEDIUM",
    account_status: "ACTIVE",
    created_at: "2024-02-10T09:00:00Z",
    updated_at: "2024-02-15T11:00:00Z",
  },
  {
    id: "3",
    full_name: "Pedro Costa",
    email: "pedro.costa@terceiros.com",
    verification_level: "LOW",
    account_status: "SUSPENDED",
    created_at: "2024-03-01T08:00:00Z",
    updated_at: "2024-03-10T16:00:00Z",
  },
  {
    id: "4",
    full_name: "Ana Oliveira",
    email: "ana.oliveira@visitante.com",
    verification_level: "LOW",
    account_status: "ACTIVE",
    created_at: "2024-03-15T14:00:00Z",
    updated_at: "2024-03-15T14:00:00Z",
  },
  {
    id: "5",
    full_name: "Carlos Ferreira",
    email: "carlos.ferreira@empresa.com",
    verification_level: "HIGH",
    account_status: "BLOCKED",
    created_at: "2023-11-20T10:00:00Z",
    updated_at: "2024-01-05T09:00:00Z",
  },
]

export const mockDocuments: Document[] = [
  {
    id: "d1",
    user_id: "1",
    type: "EMPLOYEE_CARD",
    number: "EMP-2024-001",
    verified: true,
    verified_at: "2024-01-16T10:00:00Z",
  },
  {
    id: "d2",
    user_id: "1",
    type: "ID_CARD",
    number: "123456789",
    verified: true,
    verified_at: "2024-01-15T12:00:00Z",
  },
  {
    id: "d3",
    user_id: "2",
    type: "EMPLOYEE_CARD",
    number: "EMP-2024-002",
    verified: true,
    verified_at: "2024-02-11T09:00:00Z",
  },
  {
    id: "d4",
    user_id: "3",
    type: "PASSPORT",
    number: "BR1234567",
    verified: false,
    verified_at: null,
  },
  {
    id: "d5",
    user_id: "4",
    type: "ID_CARD",
    number: "987654321",
    verified: true,
    verified_at: "2024-03-15T15:00:00Z",
  },
  {
    id: "d6",
    user_id: "5",
    type: "EMPLOYEE_CARD",
    number: "EMP-2023-045",
    verified: true,
    verified_at: "2023-11-21T10:00:00Z",
  },
]

export const mockUserStatuses: UserStatus[] = [
  {
    id: "s1",
    user_id: "1",
    status_type: "EMPLOYEE",
    start_date: "2024-01-15",
    end_date: null,
    situation: "VALID",
  },
  {
    id: "s2",
    user_id: "2",
    status_type: "EMPLOYEE",
    start_date: "2024-02-10",
    end_date: "2024-12-31",
    situation: "VALID",
  },
  {
    id: "s3",
    user_id: "3",
    status_type: "CONTRACTOR",
    start_date: "2024-03-01",
    end_date: "2024-06-30",
    situation: "REVOKED",
  },
  {
    id: "s4",
    user_id: "4",
    status_type: "VISITOR",
    start_date: "2024-03-15",
    end_date: "2024-03-20",
    situation: "EXPIRED",
  },
  {
    id: "s5",
    user_id: "5",
    status_type: "EMPLOYEE",
    start_date: "2023-11-20",
    end_date: "2024-11-20",
    situation: "REVOKED",
  },
]

export const mockShareCodes: ShareCode[] = [
  {
    code: "ABC123XY",
    user_id: "1",
    expires_at: "2024-04-15T23:59:59Z",
    purpose: "Acesso temporário ao setor administrativo",
  },
  {
    code: "DEF456ZW",
    user_id: "2",
    expires_at: "2024-03-30T23:59:59Z",
    purpose: "Verificação de credenciais",
  },
  {
    code: "GHI789AB",
    user_id: "4",
    expires_at: "2024-03-20T18:00:00Z",
    purpose: "Visita técnica",
  },
]

export function getUserWithDetails(userId: string): UserWithDetails | null {
  const user = mockUsers.find((u) => u.id === userId)
  if (!user) return null

  return {
    ...user,
    documents: mockDocuments.filter((d) => d.user_id === userId),
    statuses: mockUserStatuses.filter((s) => s.user_id === userId),
    share_codes: mockShareCodes.filter((c) => c.user_id === userId),
  }
}

export function getAllUsersWithDetails(): UserWithDetails[] {
  return mockUsers.map((user) => ({
    ...user,
    documents: mockDocuments.filter((d) => d.user_id === user.id),
    statuses: mockUserStatuses.filter((s) => s.user_id === user.id),
    share_codes: mockShareCodes.filter((c) => c.user_id === user.id),
  }))
}
