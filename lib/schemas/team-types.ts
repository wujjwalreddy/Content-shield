// Team management data types

export interface ModerationTeam {
  id: string
  name: string
  description: string
  createdAt: string | Date
  createdBy: string // UID of the admin who created the team
  members: string[] // Array of user UIDs
  platforms: string[] // Platforms this team moderates
  categories: string[] // Content categories this team handles
  stats?: {
    contentReviewed: number
    contentRemoved: number
    averageResponseTime: number // in minutes
  }
}

export interface TeamMember {
  uid: string
  displayName: string | null
  email: string | null
  photoURL: string | null
  role: string
  joinedAt: string | Date
}

