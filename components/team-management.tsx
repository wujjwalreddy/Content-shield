"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash, Users, BarChart, Clock, CheckCircle, UserPlus, UserMinus } from "lucide-react"
import {
  getMockTeams,
  getMockTeamMembers,
  createMockTeam,
  updateMockTeam,
  deleteMockTeam,
  addMockTeamMember,
  removeMockTeamMember,
} from "@/lib/services/mock-team-service"
import { getMockUsers } from "@/lib/services/mock-user-service"
import type { ModerationTeam, TeamMember } from "@/lib/schemas/team-types"
import type { UserListItem } from "@/lib/schemas/user-types"

interface TeamManagementProps {
  adminId: string
}

export function TeamManagement({ adminId }: TeamManagementProps) {
  const [teams, setTeams] = useState<ModerationTeam[]>([])
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<ModerationTeam | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [availableUsers, setAvailableUsers] = useState<UserListItem[]>([])

  // Create team state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTeam, setNewTeam] = useState<{
    name: string
    description: string
    platforms: string[]
    categories: string[]
  }>({
    name: "",
    description: "",
    platforms: [],
    categories: [],
  })

  // Edit team state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editTeam, setEditTeam] = useState<{
    id: string
    name: string
    description: string
    platforms: string[]
    categories: string[]
  }>({
    id: "",
    name: "",
    description: "",
    platforms: [],
    categories: [],
  })

  // Delete team state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [teamToDelete, setTeamToDelete] = useState<ModerationTeam | null>(null)

  // Add member state
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamsData, usersData] = await Promise.all([getMockTeams(), getMockUsers()])

        setTeams(teamsData)
        setUsers(usersData.filter((user) => user.approved && user.role !== "pending"))

        if (teamsData.length > 0) {
          setSelectedTeam(teamsData[0])
          const members = await getMockTeamMembers(teamsData[0].id)
          setTeamMembers(members)

          // Set available users (users not in the team)
          const memberIds = members.map((member) => member.uid)
          setAvailableUsers(
            usersData.filter((user) => user.approved && user.role !== "pending" && !memberIds.includes(user.uid)),
          )
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [adminId])

  const handleSelectTeam = async (team: ModerationTeam) => {
    setSelectedTeam(team)
    try {
      const members = await getMockTeamMembers(team.id)
      setTeamMembers(members)

      // Update available users
      const memberIds = members.map((member) => member.uid)
      setAvailableUsers(users.filter((user) => !memberIds.includes(user.uid)))
    } catch (error) {
      console.error("Error fetching team members:", error)
    }
  }

  const handleCreateTeam = async () => {
    try {
      if (!newTeam.name) {
        alert("Team name is required")
        return
      }

      const teamData = {
        ...newTeam,
        createdAt: new Date(),
        createdBy: adminId,
        members: [adminId], // Add the admin as the first member
      }

      await createMockTeam(teamData)

      // Refresh teams
      const updatedTeams = await getMockTeams()
      setTeams(updatedTeams)

      // Reset form and close dialog
      setNewTeam({
        name: "",
        description: "",
        platforms: [],
        categories: [],
      })
      setIsCreateDialogOpen(false)

      // Select the newly created team
      if (updatedTeams.length > 0) {
        const newlyCreatedTeam = updatedTeams[updatedTeams.length - 1]
        handleSelectTeam(newlyCreatedTeam)
      }
    } catch (error) {
      console.error("Error creating team:", error)
    }
  }

  const handleEditTeam = (team: ModerationTeam) => {
    setEditTeam({
      id: team.id,
      name: team.name,
      description: team.description,
      platforms: team.platforms,
      categories: team.categories,
    })
    setIsEditDialogOpen(true)
  }

  const saveTeamChanges = async () => {
    try {
      if (!editTeam.name) {
        alert("Team name is required")
        return
      }

      await updateMockTeam(editTeam.id, {
        name: editTeam.name,
        description: editTeam.description,
        platforms: editTeam.platforms,
        categories: editTeam.categories,
      })

      // Refresh teams
      const updatedTeams = await getMockTeams()
      setTeams(updatedTeams)

      // Update selected team if it's the one being edited
      if (selectedTeam && selectedTeam.id === editTeam.id) {
        const updatedTeam = updatedTeams.find((team) => team.id === editTeam.id)
        if (updatedTeam) {
          setSelectedTeam(updatedTeam)
        }
      }

      // Close dialog
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating team:", error)
    }
  }

  const handleDeleteTeam = (team: ModerationTeam) => {
    setTeamToDelete(team)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return

    try {
      await deleteMockTeam(teamToDelete.id)

      // Refresh teams
      const updatedTeams = await getMockTeams()
      setTeams(updatedTeams)

      // If the deleted team was selected, select another team
      if (selectedTeam && selectedTeam.id === teamToDelete.id) {
        if (updatedTeams.length > 0) {
          handleSelectTeam(updatedTeams[0])
        } else {
          setSelectedTeam(null)
          setTeamMembers([])
        }
      }

      // Close dialog
      setIsDeleteDialogOpen(false)
      setTeamToDelete(null)
    } catch (error) {
      console.error("Error deleting team:", error)
    }
  }

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedUserId) return

    try {
      await addMockTeamMember(selectedTeam.id, selectedUserId)

      // Refresh team members
      const members = await getMockTeamMembers(selectedTeam.id)
      setTeamMembers(members)

      // Update available users
      const memberIds = members.map((member) => member.uid)
      setAvailableUsers(users.filter((user) => !memberIds.includes(user.uid)))

      // Refresh teams to update the members count
      const updatedTeams = await getMockTeams()
      setTeams(updatedTeams)

      // Update selected team
      const updatedTeam = updatedTeams.find((team) => team.id === selectedTeam.id)
      if (updatedTeam) {
        setSelectedTeam(updatedTeam)
      }

      // Reset and close dialog
      setSelectedUserId("")
      setIsAddMemberDialogOpen(false)
    } catch (error) {
      console.error("Error adding team member:", error)
    }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!selectedTeam) return

    try {
      await removeMockTeamMember(selectedTeam.id, userId)

      // Refresh team members
      const members = await getMockTeamMembers(selectedTeam.id)
      setTeamMembers(members)

      // Update available users
      const memberIds = members.map((member) => member.uid)
      setAvailableUsers(users.filter((user) => !memberIds.includes(user.uid)))

      // Refresh teams to update the members count
      const updatedTeams = await getMockTeams()
      setTeams(updatedTeams)

      // Update selected team
      const updatedTeam = updatedTeams.find((team) => team.id === selectedTeam.id)
      if (updatedTeam) {
        setSelectedTeam(updatedTeam)
      }
    } catch (error) {
      console.error("Error removing team member:", error)
    }
  }

  const togglePlatform = (platform: string) => {
    if (isCreateDialogOpen) {
      if (newTeam.platforms.includes(platform)) {
        setNewTeam({
          ...newTeam,
          platforms: newTeam.platforms.filter((p) => p !== platform),
        })
      } else {
        setNewTeam({
          ...newTeam,
          platforms: [...newTeam.platforms, platform],
        })
      }
    } else if (isEditDialogOpen) {
      if (editTeam.platforms.includes(platform)) {
        setEditTeam({
          ...editTeam,
          platforms: editTeam.platforms.filter((p) => p !== platform),
        })
      } else {
        setEditTeam({
          ...editTeam,
          platforms: [...editTeam.platforms, platform],
        })
      }
    }
  }

  const toggleCategory = (category: string) => {
    if (isCreateDialogOpen) {
      if (newTeam.categories.includes(category)) {
        setNewTeam({
          ...newTeam,
          categories: newTeam.categories.filter((c) => c !== category),
        })
      } else {
        setNewTeam({
          ...newTeam,
          categories: [...newTeam.categories, category],
        })
      }
    } else if (isEditDialogOpen) {
      if (editTeam.categories.includes(category)) {
        setEditTeam({
          ...editTeam,
          categories: editTeam.categories.filter((c) => c !== category),
        })
      } else {
        setEditTeam({
          ...editTeam,
          categories: [...editTeam.categories, category],
        })
      }
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[400px]">Loading teams...</div>
  }

  const platforms = ["Twitter", "Reddit", "Facebook", "Instagram", "YouTube", "TikTok", "Other"]
  const categories = ["Hate Speech", "Misinformation", "Cyberbullying", "Harassment", "Self-harm", "Threats", "Other"]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Moderation Teams</h2>
          <Badge variant="outline" className="ml-2">
            {teams.length} Teams
          </Badge>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-blue-purple hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
              <DialogDescription>Create a new moderation team and assign responsibilities</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team-name" className="text-right">
                  Team Name
                </Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., Hate Speech Team"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="team-description"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Describe the team's responsibilities"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Platforms</Label>
                <div className="col-span-3 space-y-2">
                  {platforms.map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${platform}`}
                        checked={newTeam.platforms.includes(platform)}
                        onCheckedChange={() => togglePlatform(platform)}
                      />
                      <Label htmlFor={`platform-${platform}`}>{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">Categories</Label>
                <div className="col-span-3 space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={newTeam.categories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTeam}>Create Team</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {teams.length === 0 ? (
        <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
          <CardContent className="flex flex-col items-center justify-center h-40 p-6">
            <Users className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No teams created yet</p>
            <p className="text-sm text-muted-foreground">Create a team to start managing moderators</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Card className="bg-white dark:bg-gray-800 shadow-md border-none h-full">
              <CardHeader>
                <CardTitle>Teams</CardTitle>
                <CardDescription>Select a team to manage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTeam?.id === team.id
                          ? "bg-primary/10 border-primary/30"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => handleSelectTeam(team)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{team.name}</h3>
                        <Badge variant="outline">{team.members.length} Members</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{team.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            {selectedTeam ? (
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{selectedTeam.name}</CardTitle>
                    <CardDescription>{selectedTeam.description}</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTeam(selectedTeam)}>
                      <Edit className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteTeam(selectedTeam)}>
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="members">
                    <TabsList className="mb-4">
                      <TabsTrigger value="members">Members</TabsTrigger>
                      <TabsTrigger value="details">Team Details</TabsTrigger>
                      {selectedTeam.stats && <TabsTrigger value="stats">Statistics</TabsTrigger>}
                    </TabsList>

                    <TabsContent value="members">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-medium">Team Members</h3>
                          <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <UserPlus className="mr-1 h-3.5 w-3.5" />
                                Add Member
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Add Team Member</DialogTitle>
                                <DialogDescription>Add a user to the {selectedTeam.name} team</DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="user-select">Select User</Label>
                                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableUsers.length === 0 ? (
                                        <SelectItem value="none" disabled>
                                          No available users
                                        </SelectItem>
                                      ) : (
                                        availableUsers.map((user) => (
                                          <SelectItem key={user.uid} value={user.uid}>
                                            {user.displayName} ({user.email})
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleAddMember} disabled={!selectedUserId}>
                                  Add to Team
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="space-y-3">
                          {teamMembers.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">No members in this team</div>
                          ) : (
                            teamMembers.map((member) => (
                              <div key={member.uid} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage src={member.photoURL || ""} alt={member.displayName || ""} />
                                    <AvatarFallback>
                                      {member.displayName?.substring(0, 2).toUpperCase() || "U"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{member.displayName}</p>
                                    <p className="text-xs text-muted-foreground">{member.email}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant={member.role === "admin" ? "default" : "outline"}
                                    className={
                                      member.role === "admin" ? "bg-blue-500" : "border-green-500 text-green-500"
                                    }
                                  >
                                    {member.role}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveMember(member.uid)}
                                    disabled={member.role === "admin" && member.uid === adminId} // Prevent removing self if admin
                                  >
                                    <UserMinus className="h-4 w-4 text-red-500" />
                                    <span className="sr-only">Remove member</span>
                                  </Button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="details">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Platforms</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTeam.platforms.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No platforms assigned</p>
                            ) : (
                              selectedTeam.platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-sm">
                                  {platform}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">Content Categories</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedTeam.categories.length === 0 ? (
                              <p className="text-sm text-muted-foreground">No categories assigned</p>
                            ) : (
                              selectedTeam.categories.map((category) => (
                                <Badge key={category} variant="secondary" className="text-sm">
                                  {category}
                                </Badge>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-2">Team Information</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Created:</span>
                              <span className="text-sm">
                                {typeof selectedTeam.createdAt === "string"
                                  ? selectedTeam.createdAt
                                  : new Date(selectedTeam.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Created by:</span>
                              <span className="text-sm">
                                {users.find((user) => user.uid === selectedTeam.createdBy)?.displayName ||
                                  selectedTeam.createdBy}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Team ID:</span>
                              <span className="text-sm">{selectedTeam.id}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {selectedTeam.stats && (
                      <TabsContent value="stats">
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex flex-col items-center">
                                  <BarChart className="h-8 w-8 text-blue-500 mb-2" />
                                  <h3 className="text-xl font-bold">{selectedTeam.stats.contentReviewed}</h3>
                                  <p className="text-sm text-muted-foreground">Content Reviewed</p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex flex-col items-center">
                                  <CheckCircle className="h-8 w-8 text-red-500 mb-2" />
                                  <h3 className="text-xl font-bold">{selectedTeam.stats.contentRemoved}</h3>
                                  <p className="text-sm text-muted-foreground">Content Removed</p>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardContent className="pt-6">
                                <div className="flex flex-col items-center">
                                  <Clock className="h-8 w-8 text-green-500 mb-2" />
                                  <h3 className="text-xl font-bold">{selectedTeam.stats.averageResponseTime} min</h3>
                                  <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Team Performance</h3>
                            <div className="h-[200px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md">
                              <p className="text-muted-foreground">Performance chart will be displayed here</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
                <CardContent className="flex flex-col items-center justify-center h-[400px] p-6">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Select a team</p>
                  <p className="text-sm text-muted-foreground">Choose a team from the list to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team details and responsibilities</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-team-name" className="text-right">
                Team Name
              </Label>
              <Input
                id="edit-team-name"
                value={editTeam.name}
                onChange={(e) => setEditTeam({ ...editTeam, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-team-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-team-description"
                value={editTeam.description}
                onChange={(e) => setEditTeam({ ...editTeam, description: e.target.value })}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Platforms</Label>
              <div className="col-span-3 space-y-2">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-platform-${platform}`}
                      checked={editTeam.platforms.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                    />
                    <Label htmlFor={`edit-platform-${platform}`}>{platform}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Categories</Label>
              <div className="col-span-3 space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-category-${category}`}
                      checked={editTeam.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <Label htmlFor={`edit-category-${category}`}>{category}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTeamChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this team? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {teamToDelete && (
            <div className="py-4">
              <p className="font-medium">{teamToDelete.name}</p>
              <p className="text-sm text-muted-foreground">{teamToDelete.description}</p>
              <p className="text-sm text-muted-foreground mt-2">
                This team has {teamToDelete.members.length} members who will be unassigned.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteTeam}>
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

