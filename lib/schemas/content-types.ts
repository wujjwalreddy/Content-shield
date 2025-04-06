// Content moderation data types

export type ContentSeverity = "Critical" | "High" | "Medium" | "Low"

export type ContentCategory =
  | "Hate Speech"
  | "Misinformation"
  | "Cyberbullying"
  | "Harassment"
  | "Self-harm"
  | "Threats"
  | "Other"

export type Platform = "Twitter" | "Reddit" | "Facebook" | "Instagram" | "YouTube" | "TikTok" | "Other"

export type AIDecision = "Remove" | "Flag for Review" | "Approve"

export type ModeratorAction = "Removed" | "Approved" | "Warned" | "Escalated" | "Reviewed"

export interface FlaggedContent {
  id: string
  platform: Platform
  username: string
  content: string
  category: ContentCategory
  severity: ContentSeverity
  timestamp: string | Date
  avatar?: string
  confidence: number
  aiDecision: AIDecision
  explanation: string
  keywords: string[]
  channelId?: string
  userId: string // The user who owns this content (for data segregation)
  reviewedBy?: string
  reviewedAt?: string | Date
  reviewDecision?: "approve" | "remove"
}

export interface ModeratorActivity {
  id: string
  moderator: string
  moderatorId: string
  action: ModeratorAction
  content: string
  contentId?: string
  timestamp: string | Date
  avatar?: string
  userId: string // The user who owns this activity (for data segregation)
}

export interface Alert {
  id: string
  platform: Platform
  username: string
  content: string
  category: ContentCategory
  severity: ContentSeverity
  timestamp: string | Date
  avatar?: string
  userId: string // The user who owns this alert (for data segregation)
}

export interface MonitoredChannel {
  id: string
  name: string
  platform: Platform
  channelId: string
  monitoringEnabled: boolean
  moderationSettings: {
    autoRemove: boolean
    autoRemoveThreshold: number
    notifyOnFlag: boolean
    categories: ContentCategory[]
  }
  userId: string // The user who owns this channel (for data segregation)
}

export interface ContentStats {
  totalFlagged: number
  pendingReview: number
  aiAccuracy: number
  humanOverrides: number
  categoryBreakdown: {
    category: ContentCategory
    count: number
    percentage: number
  }[]
  userId: string // The user who owns these stats (for data segregation)
}

export interface AnalyticsData {
  timeRange: "day" | "week" | "month" | "year"
  flaggedOverTime: {
    date: string
    count: number
  }[]
  categoryTrends: {
    date: string
    [key in ContentCategory]?: number
  }[]
  platformBreakdown: {
    platform: Platform
    count: number
    percentage: number
  }[]
  accuracyOverTime: {
    date: string
    accuracy: number
  }[]
  userId: string // The user who owns this data (for data segregation)
}

