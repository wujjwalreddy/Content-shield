"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react"
import {
  getMockPendingUsers,
  updateMockUserRole,
  updateMockUserTeams,
  deleteMockUser,
} from "@/lib/services/mock-user-service"
import { getMockTeams } from "@/lib/services/mock-team-service"
import type { UserListItem, UserRole } from "@/lib/schemas/user-types"
import type { ModerationTeam } from "@/lib/schemas/team-types"

interface PendingApprovalsProps {
  adminId: string
}

export function PendingApprovals({ adminId }: PendingApprovalsProps) {
  const [pendingUsers, setPendingUsers] = useState<UserListItem[]>([])
  const [teams, setTeams] = useState<ModerationTeam[]>([])
  const [loading, setLoading] = useState(true)

  // Approve user state
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [approveRole, setApproveRole] = useState<UserRole>("moderator")
  const [approveTeams, setApproveTeams] = useState<string[]>([])

  // Reject user state
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [userToReject, setUserToReject] = useState<UserListItem | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [pendingUsersData, teamsData] = await Promise.all([getMockPendingUsers(), getMockTeams()])

        setPendingUsers(pendingUsersData)
        setTeams(teamsData)
      } catch (error) {
        console.error("Error fetching pending users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [adminId])

  const handleApproveUser = (user: UserListItem) => {
    setSelectedUser(user)
    setApproveRole("moderator") // Default role for approved users
    setApproveTeams([])
    setIsApproveDialogOpen(true)
  }

  const handleRejectUser = (user: UserListItem) => {
    setUserToReject(user)
    setIsRejectDialogOpen(true)
  }

  const confirmApproveUser = async () => {
    if (!selectedUser) return

    try {
      // Update user role and approval status
      await updateMockUserRole(selectedUser.uid, approveRole, true)

      // Update user teams
      await updateMockUserTeams(selectedUser.uid, approveTeams)

      // Refresh pending users list
      const updatedPendingUsers = await getMockPendingUsers()
      setPendingUsers(updatedPendingUsers)

      // Close dialog
      setIsApproveDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error approving user:", error)
    }
  }

  const confirmRejectUser = async () => {
    if (!userToReject) return

    try {
      await deleteMockUser(userToReject.uid)

      // Refresh pending users list
      const updatedPendingUsers = await getMockPendingUsers()
      setPendingUsers(updatedPendingUsers)

      // Close dialog
      setIsRejectDialogOpen(false)
      setUserToReject(null)
    } catch (error) {
      console.error("Error rejecting user:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[400px]">Loading pending approvals...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Pending User Approvals</h2>
          <Badge variant="outline" className="ml-2">
            {pendingUsers.length} Pending
          </Badge>
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardContent className="flex flex-col items-center justify-center h-40 p-6">
            <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
            <p className="text-lg font-medium">No pending approvals</p>
            <p className="text-sm text-muted-foreground">All user accounts have been processed</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user) => (
            <Card key={user.uid} className="bg-white dark:bg-gray-800 shadow-md border-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.displayName}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          Registered:{" "}
                          {typeof user.createdAt === "string"
                            ? user.createdAt
                            : new Date(user.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 md:ml-auto">
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                      onClick={() => handleApproveUser(user)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleRejectUser(user)}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Approve User Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Approve User</DialogTitle>
            <DialogDescription>Approve this user and assign a role and teams</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.photoURL || ""} alt={selectedUser.displayName || ""} />
                  <AvatarFallback>{selectedUser.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.displayName}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Select value={approveRole} onValueChange={(value) => setApproveRole(value as UserRole)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Assign Teams</Label>
                <div className="col-span-3 space-y-2">
                  {teams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No teams available</p>
                  ) : (
                    teams.map((team) => (
                      <div key={team.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`team-${team.id}`}
                          checked={approveTeams.includes(team.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setApproveTeams([...approveTeams, team.id])
                            } else {
                              setApproveTeams(approveTeams.filter((id) => id !== team.id))
                            }
                          }}
                        />
                        <Label htmlFor={`team-${team.id}`}>{team.name}</Label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                <AlertTriangle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Approving this user will grant them access to the content moderation platform with the selected role
                  and team assignments.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApproveUser} className="bg-green-600 hover:bg-green-700">
              Approve User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject User Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reject User</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToReject && (
            <div className="flex items-center space-x-3 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userToReject.photoURL || ""} alt={userToReject.displayName || ""} />
                <AvatarFallback>{userToReject.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userToReject.displayName}</p>
                <p className="text-xs text-muted-foreground">{userToReject.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectUser}>
              Reject User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

