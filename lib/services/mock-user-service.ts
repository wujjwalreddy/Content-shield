import type { UserRole, UserListItem } from "@/lib/schemas/user-types"

// Mock users for development
export const mockUsers: UserListItem[] = [
  {
    uid: "123456",
    email: "admin@example.com",
    displayName: "Admin User",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "admin",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    teams: ["team1", "team2"],
  },
  {
    uid: "234567",
    email: "moderator1@example.com",
    displayName: "Alex Johnson",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25), // 25 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    teams: ["team1"],
  },
  {
    uid: "345678",
    email: "moderator2@example.com",
    displayName: "Sam Wilson",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20), // 20 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    teams: ["team1", "team2"],
  },
  {
    uid: "456789",
    email: "moderator3@example.com",
    displayName: "Jamie Smith",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15), // 15 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    teams: ["team2"],
  },
  {
    uid: "567890",
    email: "moderator4@example.com",
    displayName: "Taylor Reed",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    teams: ["team3"],
  },
  {
    uid: "678901",
    email: "moderator5@example.com",
    displayName: "Morgan Chen",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    approved: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    teams: ["team3"],
  },
  {
    uid: "789012",
    email: "pending1@example.com",
    displayName: "Jordan Lee",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "pending",
    approved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    teams: [],
  },
  {
    uid: "890123",
    email: "pending2@example.com",
    displayName: "Casey Kim",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "pending",
    approved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    teams: [],
  },
  {
    uid: "901234",
    email: "pending3@example.com",
    displayName: "Riley Garcia",
    photoURL: "/placeholder.svg?height=40&width=40",
    role: "pending",
    approved: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    teams: [],
  },
]

// Mock service functions
export function getMockUsers(): Promise<UserListItem[]> {
  return Promise.resolve([...mockUsers])
}

export function getMockPendingUsers(): Promise<UserListItem[]> {
  return Promise.resolve(mockUsers.filter((user) => user.role === "pending" && !user.approved))
}

export function getMockUser(uid: string): Promise<UserListItem | null> {
  const user = mockUsers.find((user) => user.uid === uid)
  return Promise.resolve(user || null)
}

export function updateMockUserRole(uid: string, role: UserRole, approved: boolean): Promise<void> {
  const userIndex = mockUsers.findIndex((user) => user.uid === uid)
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      role,
      approved,
    }
    return Promise.resolve()
  }
  return Promise.reject(new Error("User not found"))
}

export function updateMockUserTeams(uid: string, teams: string[]): Promise<void> {
  const userIndex = mockUsers.findIndex((user) => user.uid === uid)
  if (userIndex !== -1) {
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      teams,
    }
    return Promise.resolve()
  }
  return Promise.reject(new Error("User not found"))
}

export function deleteMockUser(uid: string): Promise<void> {
  const userIndex = mockUsers.findIndex((user) => user.uid === uid)
  if (userIndex !== -1) {
    mockUsers.splice(userIndex, 1)
    return Promise.resolve()
  }
  return Promise.reject(new Error("User not found"))
}

