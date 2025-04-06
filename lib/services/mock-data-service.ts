import type {
  FlaggedContent,
  ModeratorActivity,
  Alert,
  MonitoredChannel,
  ContentStats,
  AnalyticsData,
} from "@/lib/schemas/content-types"

// Mock data for development
export const mockFlaggedContent: FlaggedContent[] = [
  {
    id: "1",
    platform: "Twitter",
    username: "user123",
    content:
      "This is a highly concerning post with threatening language that violates community guidelines and contains harmful rhetoric.",
    category: "Threats",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.92,
    aiDecision: "Remove",
    explanation:
      "This content contains explicit threats of violence against an individual or group. The language used includes specific threatening phrases that violate platform policies on safety. The AI detected multiple indicators of threatening behavior with high confidence.",
    keywords: ["threatening", "violence", "harmful", "rhetoric"],
    userId: "123456",
  },
  {
    id: "2",
    platform: "Reddit",
    username: "redditUser456",
    content:
      "Post containing harmful misinformation about health issues that could potentially cause real-world harm if believed by vulnerable individuals.",
    category: "Misinformation",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.87,
    aiDecision: "Remove",
    explanation:
      "This content contains false health information that contradicts established medical consensus and could lead to harmful outcomes if followed. The claims made are not supported by scientific evidence and have been previously debunked by health authorities.",
    keywords: ["misinformation", "health", "false", "debunked"],
    userId: "123456",
  },
  {
    id: "3",
    platform: "Twitter",
    username: "tweetPerson789",
    content:
      "Multiple slurs and offensive language targeting minorities and protected groups. This content clearly violates platform policies on hate speech.",
    category: "Hate Speech",
    severity: "Critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.95,
    aiDecision: "Remove",
    explanation:
      "This content contains multiple slurs and derogatory terms targeting specific protected groups. The language used is explicitly discriminatory and violates platform policies against hate speech. The context indicates intentional targeting rather than educational or discussion purposes.",
    keywords: ["slurs", "offensive", "targeting", "discriminatory"],
    userId: "123456",
  },
  {
    id: "4",
    platform: "Reddit",
    username: "redditor101",
    content:
      "Coordinated harassment campaign against a specific user with multiple accounts involved in targeting behavior over several days.",
    category: "Harassment",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.89,
    aiDecision: "Remove",
    explanation:
      "This content is part of a coordinated harassment campaign targeting a specific user. Analysis shows patterns of repeated targeting from multiple accounts with similar language and timing. The content includes personal attacks and attempts to intimidate the targeted user.",
    keywords: ["harassment", "coordinated", "targeting", "multiple accounts"],
    userId: "123456",
  },
  {
    id: "5",
    platform: "Twitter",
    username: "tweetUser567",
    content:
      "Content that appears to be promoting self-harm behaviors with detailed descriptions that could be harmful to vulnerable users.",
    category: "Self-harm",
    severity: "Critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.93,
    aiDecision: "Remove",
    explanation:
      "This content contains detailed descriptions of self-harm methods that could be instructional to vulnerable users. The language used appears to glorify or promote self-harm behaviors rather than discussing recovery or awareness. The specific details provided pose a risk to users who may be susceptible to self-harm.",
    keywords: ["self-harm", "detailed", "promoting", "vulnerable"],
    userId: "123456",
  },
  {
    id: "6",
    platform: "Reddit",
    username: "redditPoster888",
    content:
      "Post containing conspiracy theories about public health measures with potential to cause real-world harm through misinformation.",
    category: "Misinformation",
    severity: "Medium",
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    avatar: "/placeholder.svg?height=40&width=40",
    confidence: 0.82,
    aiDecision: "Flag for Review",
    explanation:
      "This content contains conspiracy theories related to public health measures. While it includes some misleading claims, the confidence level is lower as some statements are ambiguous or presented as questions rather than direct claims. Human review is recommended to assess context and potential harm.",
    keywords: ["conspiracy", "public health", "misleading", "ambiguous"],
    userId: "123456",
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    platform: "Twitter",
    username: "user123",
    content: "This is a highly concerning post with threatening language...",
    category: "Threats",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    userId: "123456",
  },
  {
    id: "2",
    platform: "Reddit",
    username: "redditUser456",
    content: "Post containing harmful misinformation about health issues...",
    category: "Misinformation",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    userId: "123456",
  },
  {
    id: "3",
    platform: "Twitter",
    username: "tweetPerson789",
    content: "Multiple slurs and offensive language targeting minorities...",
    category: "Hate Speech",
    severity: "Critical",
    timestamp: new Date(Date.now() - 1000 * 60 * 32), // 32 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    userId: "123456",
  },
  {
    id: "4",
    platform: "Reddit",
    username: "redditor101",
    content: "Coordinated harassment campaign against a specific user...",
    category: "Harassment",
    severity: "High",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    avatar: "/placeholder.svg?height=40&width=40",
    userId: "123456",
  },
]

export const mockModeratorActivity: ModeratorActivity[] = [
  {
    id: "1",
    moderator: "Alex Johnson",
    moderatorId: "mod1",
    action: "Removed",
    content: "Post containing hate speech",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
    userId: "123456",
  },
  {
    id: "2",
    moderator: "Sam Wilson",
    moderatorId: "mod2",
    action: "Approved",
    content: "Flagged post (false positive)",
    timestamp: new Date(Date.now() - 1000 * 60 * 12), // 12 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
    userId: "123456",
  },
  {
    id: "3",
    moderator: "Jamie Smith",
    moderatorId: "mod3",
    action: "Warned",
    content: "User for borderline content",
    timestamp: new Date(Date.now() - 1000 * 60 * 27), // 27 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
    userId: "123456",
  },
  {
    id: "4",
    moderator: "Taylor Reed",
    moderatorId: "mod4",
    action: "Escalated",
    content: "Complex case to senior team",
    timestamp: new Date(Date.now() - 1000 * 60 * 42), // 42 minutes ago
    avatar: "/placeholder.svg?height=32&width=32",
    userId: "123456",
  },
  {
    id: "5",
    moderator: "Morgan Chen",
    moderatorId: "mod5",
    action: "Reviewed",
    content: "Multiple flagged comments",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    avatar: "/placeholder.svg?height=32&width=32",
    userId: "123456",
  },
]

export const mockContentStats: ContentStats = {
  totalFlagged: 2853,
  pendingReview: 421,
  aiAccuracy: 92.7,
  humanOverrides: 7.3,
  categoryBreakdown: [
    { category: "Hate Speech", count: 1234, percentage: 35 },
    { category: "Misinformation", count: 863, percentage: 25 },
    { category: "Cyberbullying", count: 756, percentage: 20 },
    { category: "Harassment", count: 521, percentage: 15 },
    { category: "Other", count: 179, percentage: 5 },
  ],
  userId: "123456",
}

export const mockMonitoredChannels: MonitoredChannel[] = [
  {
    id: "1",
    name: "Tech News",
    platform: "Twitter",
    channelId: "technews",
    monitoringEnabled: true,
    moderationSettings: {
      autoRemove: true,
      autoRemoveThreshold: 0.95,
      notifyOnFlag: true,
      categories: ["Hate Speech", "Misinformation", "Harassment"],
    },
    userId: "123456",
  },
  {
    id: "2",
    name: "Gaming Community",
    platform: "Reddit",
    channelId: "r/gaming",
    monitoringEnabled: true,
    moderationSettings: {
      autoRemove: false,
      autoRemoveThreshold: 0.9,
      notifyOnFlag: true,
      categories: ["Hate Speech", "Harassment", "Cyberbullying"],
    },
    userId: "123456",
  },
  {
    id: "3",
    name: "News Discussion",
    platform: "Facebook",
    channelId: "newsdiscussion",
    monitoringEnabled: true,
    moderationSettings: {
      autoRemove: true,
      autoRemoveThreshold: 0.92,
      notifyOnFlag: true,
      categories: ["Misinformation", "Hate Speech"],
    },
    userId: "123456",
  },
  {
    id: "4",
    name: "Entertainment Channel",
    platform: "YouTube",
    channelId: "UCentertainment",
    monitoringEnabled: false,
    moderationSettings: {
      autoRemove: false,
      autoRemoveThreshold: 0.85,
      notifyOnFlag: true,
      categories: ["Hate Speech", "Harassment"],
    },
    userId: "123456",
  },
  {
    id: "5",
    name: "Fashion & Lifestyle",
    platform: "Instagram",
    channelId: "fashionlifestyle",
    monitoringEnabled: true,
    moderationSettings: {
      autoRemove: false,
      autoRemoveThreshold: 0.9,
      notifyOnFlag: true,
      categories: ["Harassment", "Self-harm"],
    },
    userId: "123456",
  },
]

export const mockAnalyticsData: AnalyticsData = {
  timeRange: "month",
  flaggedOverTime: [
    { date: "2023-01-01", count: 120 },
    { date: "2023-01-02", count: 145 },
    { date: "2023-01-03", count: 132 },
    { date: "2023-01-04", count: 167 },
    { date: "2023-01-05", count: 189 },
    { date: "2023-01-06", count: 156 },
    { date: "2023-01-07", count: 143 },
    { date: "2023-01-08", count: 178 },
    { date: "2023-01-09", count: 198 },
    { date: "2023-01-10", count: 167 },
    { date: "2023-01-11", count: 145 },
    { date: "2023-01-12", count: 189 },
    { date: "2023-01-13", count: 213 },
    { date: "2023-01-14", count: 198 },
    { date: "2023-01-15", count: 176 },
    { date: "2023-01-16", count: 156 },
    { date: "2023-01-17", count: 187 },
    { date: "2023-01-18", count: 201 },
    { date: "2023-01-19", count: 189 },
    { date: "2023-01-20", count: 167 },
    { date: "2023-01-21", count: 145 },
    { date: "2023-01-22", count: 178 },
    { date: "2023-01-23", count: 198 },
    { date: "2023-01-24", count: 213 },
    { date: "2023-01-25", count: 234 },
    { date: "2023-01-26", count: 256 },
    { date: "2023-01-27", count: 243 },
    { date: "2023-01-28", count: 221 },
    { date: "2023-01-29", count: 198 },
    { date: "2023-01-30", count: 187 },
    { date: "2023-01-31", count: 201 },
  ],
  categoryTrends: [
    {
      date: "2023-01-01",
      "Hate Speech": 45,
      Misinformation: 32,
      Cyberbullying: 25,
      Harassment: 18,
    },
    {
      date: "2023-01-08",
      "Hate Speech": 52,
      Misinformation: 38,
      Cyberbullying: 29,
      Harassment: 21,
    },
    {
      date: "2023-01-15",
      "Hate Speech": 58,
      Misinformation: 42,
      Cyberbullying: 32,
      Harassment: 24,
    },
    {
      date: "2023-01-22",
      "Hate Speech": 65,
      Misinformation: 48,
      Cyberbullying: 36,
      Harassment: 28,
    },
    {
      date: "2023-01-29",
      "Hate Speech": 72,
      Misinformation: 53,
      Cyberbullying: 39,
      Harassment: 31,
    },
  ],
  platformBreakdown: [
    { platform: "Twitter", count: 1245, percentage: 35 },
    { platform: "Reddit", count: 876, percentage: 25 },
    { platform: "Facebook", count: 698, percentage: 20 },
    { platform: "Instagram", count: 523, percentage: 15 },
    { platform: "YouTube", count: 176, percentage: 5 },
  ],
  accuracyOverTime: [
    { date: "2023-01-01", accuracy: 89.5 },
    { date: "2023-01-08", accuracy: 90.2 },
    { date: "2023-01-15", accuracy: 91.5 },
    { date: "2023-01-22", accuracy: 92.1 },
    { date: "2023-01-29", accuracy: 92.7 },
  ],
  userId: "123456",
}

// Mock service functions that mimic the real service but use mock data
export function getMockFlaggedContent(userId: string): Promise<FlaggedContent[]> {
  return Promise.resolve(mockFlaggedContent.filter((item) => item.userId === userId))
}

export function getMockRecentAlerts(userId: string): Promise<Alert[]> {
  return Promise.resolve(mockAlerts.filter((item) => item.userId === userId))
}

export function getMockModeratorActivity(userId: string): Promise<ModeratorActivity[]> {
  return Promise.resolve(mockModeratorActivity.filter((item) => item.userId === userId))
}

export function getMockContentStats(userId: string): Promise<ContentStats> {
  const stats = { ...mockContentStats }
  if (stats.userId === userId) {
    return Promise.resolve(stats)
  }
  return Promise.reject(new Error("Content stats not found for this user"))
}

export function getMockAnalyticsData(userId: string): Promise<AnalyticsData> {
  const analytics = { ...mockAnalyticsData }
  if (analytics.userId === userId) {
    return Promise.resolve(analytics)
  }
  return Promise.reject(new Error("Analytics data not found for this user"))
}

export function getMockMonitoredChannels(userId: string): Promise<MonitoredChannel[]> {
  return Promise.resolve(mockMonitoredChannels.filter((item) => item.userId === userId))
}

export function addMockMonitoredChannel(channel: Omit<MonitoredChannel, "id">): Promise<string> {
  const id = `${mockMonitoredChannels.length + 1}`
  mockMonitoredChannels.push({ ...channel, id })
  return Promise.resolve(id)
}

export function updateMockMonitoredChannel(id: string, updates: Partial<MonitoredChannel>): Promise<void> {
  const index = mockMonitoredChannels.findIndex((channel) => channel.id === id)
  if (index !== -1) {
    mockMonitoredChannels[index] = { ...mockMonitoredChannels[index], ...updates }
    return Promise.resolve()
  }
  return Promise.reject(new Error("Channel not found"))
}

export function deleteMockMonitoredChannel(id: string): Promise<void> {
  const index = mockMonitoredChannels.findIndex((channel) => channel.id === id)
  if (index !== -1) {
    mockMonitoredChannels.splice(index, 1)
    return Promise.resolve()
  }
  return Promise.reject(new Error("Channel not found"))
}

export function reviewMockContent(
  contentId: string,
  decision: "approve" | "remove",
  moderatorId: string,
): Promise<void> {
  const index = mockFlaggedContent.findIndex((content) => content.id === contentId)
  if (index !== -1) {
    mockFlaggedContent[index] = {
      ...mockFlaggedContent[index],
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
      reviewDecision: decision,
    }

    // Add to moderator activity
    const newActivity: ModeratorActivity = {
      id: `${mockModeratorActivity.length + 1}`,
      moderator: "Current User",
      moderatorId,
      action: decision === "approve" ? "Approved" : "Removed",
      content: mockFlaggedContent[index].content.substring(0, 50) + "...",
      contentId,
      timestamp: new Date(),
      userId: mockFlaggedContent[index].userId,
    }

    mockModeratorActivity.push(newActivity)
    return Promise.resolve()
  }
  return Promise.reject(new Error("Content not found"))
}

