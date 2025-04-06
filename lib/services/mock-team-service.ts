import type { ModerationTeam, TeamMember } from "@/lib/schemas/team-types"
import { mockUsers } from "@/lib/services/mock-user-service"

// Mock teams for development
export const mockTeams: ModerationTeam[] = [
  {
    id: "team1",
    name: "Hate Speech Team",
    description: "Specializes in moderating hate speech and discriminatory content",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    createdBy: "123456", // Admin user
    members: ["123456", "234567", "345678"], // Admin, Alex, Sam
    platforms: ["Twitter", "Reddit", "Facebook"],
    categories: ["Hate Speech", "Harassment"],
    stats: {
      contentReviewed: 1245,
      contentRemoved: 876,
      averageResponseTime: 12, // minutes
    },
  },
  {
    id: "team2",
    name: "Misinformation Team",
    description: "Focuses on fact-checking and misinformation moderation",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
    createdBy: "123456", // Admin user
    members: ["123456", "345678", "456789"], // Admin, Sam, Jamie
    platforms: ["Facebook", "Twitter", "YouTube"],
    categories: ["Misinformation"],
    stats: {
      contentReviewed: 987,
      contentRemoved: 543,
      averageResponseTime: 18, // minutes
    },
  },
  {
    id: "team3",
    name: "Self-harm & Threats Team",
    description: "Handles sensitive content related to self-harm and threats",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    createdBy: "123456", // Admin user
    members: ["567890", "678901"], // Taylor, Morgan
    platforms: ["Instagram", "TikTok", "Twitter"],
    categories: ["Self-harm", "Threats"],
    stats: {
      contentReviewed: 654,
      contentRemoved: 321,
      averageResponseTime: 8, // minutes
    },
  },
]

// Mock service functions
export function getMockTeams(): Promise<ModerationTeam[]> {
  return Promise.resolve([...mockTeams])
}

export function getMockTeam(id: string): Promise<ModerationTeam | null> {
  const team = mockTeams.find((team) => team.id === id)
  return Promise.resolve(team || null)
}

export function getMockTeamMembers(teamId: string): Promise<TeamMember[]> {
  const team = mockTeams.find((team) => team.id === teamId)
  if (!team) {
    return Promise.reject(new Error("Team not found"))
  }

  const members = team.members
    .map((uid) => {
      const user = mockUsers.find((user) => user.uid === uid)
      if (!user) return null

      return {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: user.role,
        joinedAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30), // Random date within last 30 days
      } as TeamMember
    })
    .filter((member) => member !== null) as TeamMember[]

  return Promise.resolve(members)
}

export function createMockTeam(team: Omit<ModerationTeam, "id">): Promise<string> {
  const id = `team${mockTeams.length + 1}`
  mockTeams.push({
    ...team,
    id,
    stats: {
      contentReviewed: 0,
      contentRemoved: 0,
      averageResponseTime: 0,
    },
  })
  return Promise.resolve(id)
}

export function updateMockTeam(id: string, updates: Partial<ModerationTeam>): Promise<void> {
  const teamIndex = mockTeams.findIndex((team) => team.id === id)
  if (teamIndex !== -1) {
    mockTeams[teamIndex] = {
      ...mockTeams[teamIndex],
      ...updates,
    }
    return Promise.resolve()
  }
  return Promise.reject(new Error("Team not found"))
}

export function deleteMockTeam(id: string): Promise<void> {
  const teamIndex = mockTeams.findIndex((team) => team.id === id)
  if (teamIndex !== -1) {
    mockTeams.splice(teamIndex, 1)
    return Promise.resolve()
  }
  return Promise.reject(new Error("Team not found"))
}

export function addMockTeamMember(teamId: string, userId: string): Promise<void> {
  const teamIndex = mockTeams.findIndex((team) => team.id === teamId)
  if (teamIndex === -1) {
    return Promise.reject(new Error("Team not found"))
  }

  const userExists = mockUsers.some((user) => user.uid === userId)
  if (!userExists) {
    return Promise.reject(new Error("User not found"))
  }

  if (!mockTeams[teamIndex].members.includes(userId)) {
    mockTeams[teamIndex].members.push(userId)
  }

  return Promise.resolve()
}

export function removeMockTeamMember(teamId: string, userId: string): Promise<void> {
  const teamIndex = mockTeams.findIndex((team) => team.id === teamId)
  if (teamIndex === -1) {
    return Promise.reject(new Error("Team not found"))
  }

  mockTeams[teamIndex].members = mockTeams[teamIndex].members.filter((uid) => uid !== userId)
  return Promise.resolve()
}

