// User management data types

export type UserRole = "admin" | "moderator" | "pending"

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  approved: boolean
  createdAt: string | Date
  lastLogin: string | Date
  teams: string[] // Array of team IDs the user belongs to
}

export interface PendingUser extends User {
  role: "pending"
  approved: false
}

export interface UserListItem {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  role: UserRole
  approved: boolean
  createdAt: string | Date
  lastLogin: string | Date
  teams: string[]
}

