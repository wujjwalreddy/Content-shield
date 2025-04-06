"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Search, MoreHorizontal, UserCog, Trash, CheckCircle, XCircle } from "lucide-react"
import { getMockUsers, updateMockUserRole, updateMockUserTeams, deleteMockUser } from "@/lib/services/mock-user-service"
import { getMockTeams } from "@/lib/services/mock-team-service"
import type { UserListItem, UserRole } from "@/lib/schemas/user-types"
import type { ModerationTeam } from "@/lib/schemas/team-types"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface UserManagementProps {
  adminId: string
}

export function UserManagement({ adminId }: UserManagementProps) {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [teams, setTeams] = useState<ModerationTeam[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserListItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)

  // Edit user state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserListItem | null>(null)
  const [editRole, setEditRole] = useState<UserRole>("moderator")
  const [editApproved, setEditApproved] = useState(true)
  const [editTeams, setEditTeams] = useState<string[]>([])

  // Delete user state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<UserListItem | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, teamsData] = await Promise.all([getMockUsers(), getMockTeams()])

        setUsers(usersData)
        setFilteredUsers(usersData)
        setTeams(teamsData)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [adminId])

  useEffect(() => {
    // Apply filters
    let result = [...users]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (user) => user.displayName?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query),
      )
    }

    // Apply role filter
    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    setFilteredUsers(result)
  }, [users, searchQuery, roleFilter])

  const handleEditUser = (user: UserListItem) => {
    setSelectedUser(user)
    setEditRole(user.role)
    setEditApproved(user.approved)
    setEditTeams(user.teams)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: UserListItem) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const saveUserChanges = async () => {
    if (!selectedUser) return

    try {
      // Update user role and approval status
      await updateMockUserRole(selectedUser.uid, editRole, editApproved)

      // Update user teams
      await updateMockUserTeams(selectedUser.uid, editTeams)

      // Refresh user list
      const updatedUsers = await getMockUsers()
      setUsers(updatedUsers)

      // Close dialog
      setIsEditDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await deleteMockUser(userToDelete.uid)

      // Refresh user list
      const updatedUsers = await getMockUsers()
      setUsers(updatedUsers)

      // Close dialog
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[400px]">Loading users...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                        <AvatarFallback>{user.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "moderator" ? "outline" : "secondary"}
                      className={
                        user.role === "admin"
                          ? "bg-blue-500"
                          : user.role === "moderator"
                            ? "border-green-500 text-green-500"
                            : "bg-orange-500"
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.approved ? "outline" : "secondary"}
                      className={user.approved ? "border-green-500 text-green-500" : "bg-red-500"}
                    >
                      {user.approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.teams.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No teams</span>
                      ) : (
                        user.teams.map((teamId) => {
                          const team = teams.find((t) => t.id === teamId)
                          return (
                            <Badge key={teamId} variant="secondary" className="text-xs">
                              {team?.name || teamId}
                            </Badge>
                          )
                        })
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {typeof user.lastLogin === "string" ? user.lastLogin : new Date(user.lastLogin).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <UserCog className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                        {user.role === "pending" && !user.approved && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setEditRole("moderator")
                                setEditApproved(true)
                                setEditTeams(user.teams)
                                saveUserChanges()
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user role, approval status, and team assignments</DialogDescription>
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
                <Select value={editRole} onValueChange={(value) => setEditRole(value as UserRole)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id="status"
                    checked={editApproved}
                    onCheckedChange={(checked) => setEditApproved(checked as boolean)}
                  />
                  <Label htmlFor="status">Approved</Label>
                </div>
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Teams</Label>
                <div className="col-span-3 space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`team-${team.id}`}
                        checked={editTeams.includes(team.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setEditTeams([...editTeams, team.id])
                          } else {
                            setEditTeams(editTeams.filter((id) => id !== team.id))
                          }
                        }}
                      />
                      <Label htmlFor={`team-${team.id}`}>{team.name}</Label>
                    </div>
                  ))}
                  {teams.length === 0 && <p className="text-sm text-muted-foreground">No teams available</p>}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUserChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="flex items-center space-x-3 py-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userToDelete.photoURL || ""} alt={userToDelete.displayName || ""} />
                <AvatarFallback>{userToDelete.displayName?.substring(0, 2).toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userToDelete.displayName}</p>
                <p className="text-xs text-muted-foreground">{userToDelete.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

