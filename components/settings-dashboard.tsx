"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Check, Edit, Plus, Trash, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { MonitoredChannel, Platform, ContentCategory } from "@/lib/schemas/content-types"
import {
  getMockMonitoredChannels,
  addMockMonitoredChannel,
  updateMockMonitoredChannel,
  deleteMockMonitoredChannel,
} from "@/lib/services/mock-data-service"

interface SettingsDashboardProps {
  userId: string
}

export function SettingsDashboard({ userId }: SettingsDashboardProps) {
  const [channels, setChannels] = useState<MonitoredChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [newChannel, setNewChannel] = useState<Partial<MonitoredChannel>>({
    name: "",
    platform: "Twitter",
    channelId: "",
    monitoringEnabled: true,
    moderationSettings: {
      autoRemove: false,
      autoRemoveThreshold: 0.9,
      notifyOnFlag: true,
      categories: ["Hate Speech", "Misinformation", "Harassment"],
    },
  })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingChannel, setEditingChannel] = useState<MonitoredChannel | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchChannels() {
      try {
        const data = await getMockMonitoredChannels(userId)
        setChannels(data)
      } catch (error) {
        console.error("Error fetching monitored channels:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChannels()
  }, [userId])

  const handleAddChannel = async () => {
    try {
      if (!newChannel.name || !newChannel.channelId) {
        alert("Please fill in all required fields")
        return
      }

      const channelToAdd = {
        ...newChannel,
        userId,
      } as Omit<MonitoredChannel, "id">

      await addMockMonitoredChannel(channelToAdd)

      // Refresh the channel list
      const updatedChannels = await getMockMonitoredChannels(userId)
      setChannels(updatedChannels)

      // Reset form and close dialog
      setNewChannel({
        name: "",
        platform: "Twitter",
        channelId: "",
        monitoringEnabled: true,
        moderationSettings: {
          autoRemove: false,
          autoRemoveThreshold: 0.9,
          notifyOnFlag: true,
          categories: ["Hate Speech", "Misinformation", "Harassment"],
        },
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error adding channel:", error)
    }
  }

  const handleUpdateChannel = async () => {
    try {
      if (!editingChannel) return

      await updateMockMonitoredChannel(editingChannel.id, editingChannel)

      // Refresh the channel list
      const updatedChannels = await getMockMonitoredChannels(userId)
      setChannels(updatedChannels)

      // Reset form and close dialog
      setEditingChannel(null)
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error updating channel:", error)
    }
  }

  const handleDeleteChannel = async (id: string) => {
    try {
      await deleteMockMonitoredChannel(id)

      // Refresh the channel list
      const updatedChannels = await getMockMonitoredChannels(userId)
      setChannels(updatedChannels)
    } catch (error) {
      console.error("Error deleting channel:", error)
    }
  }

  const toggleChannelMonitoring = async (id: string, enabled: boolean) => {
    try {
      await updateMockMonitoredChannel(id, { monitoringEnabled: enabled })

      // Update local state
      setChannels(channels.map((channel) => (channel.id === id ? { ...channel, monitoringEnabled: enabled } : channel)))
    } catch (error) {
      console.error("Error toggling channel monitoring:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[600px]">Loading settings...</div>
  }

  const platformIcons: Record<Platform, React.ReactNode> = {
    Twitter: <span className="w-4 h-4 rounded-full bg-twitter"></span>,
    Reddit: <span className="w-4 h-4 rounded-full bg-reddit"></span>,
    Facebook: <span className="w-4 h-4 rounded-full bg-facebook"></span>,
    Instagram: <span className="w-4 h-4 rounded-full bg-instagram"></span>,
    YouTube: <span className="w-4 h-4 rounded-full bg-youtube"></span>,
    TikTok: <span className="w-4 h-4 rounded-full bg-tiktok"></span>,
    Other: <span className="w-4 h-4 rounded-full bg-gray-500"></span>,
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="channels" className="space-y-4">
        <TabsList className="bg-white dark:bg-gray-800 shadow-md">
          <TabsTrigger value="channels">Monitored Channels</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="thresholds">AI Thresholds</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Monitored Channels</h2>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-blue-purple hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Channel
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add New Channel</DialogTitle>
                  <DialogDescription>Add a new channel to monitor for harmful content.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newChannel.name}
                      onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                      className="col-span-3"
                      placeholder="My Channel"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="platform" className="text-right">
                      Platform
                    </Label>
                    <Select
                      value={newChannel.platform}
                      onValueChange={(value) => setNewChannel({ ...newChannel, platform: value as Platform })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="Reddit">Reddit</SelectItem>
                        <SelectItem value="Facebook">Facebook</SelectItem>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="channelId" className="text-right">
                      Channel ID
                    </Label>
                    <Input
                      id="channelId"
                      value={newChannel.channelId}
                      onChange={(e) => setNewChannel({ ...newChannel, channelId: e.target.value })}
                      className="col-span-3"
                      placeholder="username or channel ID"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="monitoring" className="text-right">
                      Monitoring
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="monitoring"
                        checked={newChannel.monitoringEnabled}
                        onCheckedChange={(checked) => setNewChannel({ ...newChannel, monitoringEnabled: checked })}
                      />
                      <Label htmlFor="monitoring">Enable monitoring</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="autoRemove" className="text-right">
                      Auto-remove
                    </Label>
                    <div className="flex items-center space-x-2 col-span-3">
                      <Switch
                        id="autoRemove"
                        checked={newChannel.moderationSettings?.autoRemove}
                        onCheckedChange={(checked) =>
                          setNewChannel({
                            ...newChannel,
                            moderationSettings: {
                              ...(newChannel.moderationSettings as any),
                              autoRemove: checked,
                            },
                          })
                        }
                      />
                      <Label htmlFor="autoRemove">Automatically remove high-confidence harmful content</Label>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="threshold" className="text-right">
                      Threshold
                    </Label>
                    <div className="col-span-3 space-y-2">
                      <Slider
                        id="threshold"
                        defaultValue={[newChannel.moderationSettings?.autoRemoveThreshold || 0.9]}
                        max={1}
                        min={0.5}
                        step={0.01}
                        onValueChange={(value) =>
                          setNewChannel({
                            ...newChannel,
                            moderationSettings: {
                              ...(newChannel.moderationSettings as any),
                              autoRemoveThreshold: value[0],
                            },
                          })
                        }
                      />
                      <div className="flex justify-between">
                        <span className="text-xs">0.5</span>
                        <span className="text-xs font-medium">
                          {newChannel.moderationSettings?.autoRemoveThreshold || 0.9}
                        </span>
                        <span className="text-xs">1.0</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="categories" className="text-right pt-2">
                      Categories
                    </Label>
                    <div className="col-span-3 space-y-2">
                      {["Hate Speech", "Misinformation", "Cyberbullying", "Harassment", "Self-harm", "Threats"].map(
                        (category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={newChannel.moderationSettings?.categories?.includes(category as ContentCategory)}
                              onCheckedChange={(checked) => {
                                const currentCategories = newChannel.moderationSettings?.categories || []
                                const updatedCategories = checked
                                  ? [...currentCategories, category as ContentCategory]
                                  : currentCategories.filter((c) => c !== category)

                                setNewChannel({
                                  ...newChannel,
                                  moderationSettings: {
                                    ...(newChannel.moderationSettings as any),
                                    categories: updatedCategories,
                                  },
                                })
                              }}
                            />
                            <Label htmlFor={`category-${category}`}>{category}</Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddChannel}>Add Channel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {channels.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
                <CardContent className="flex flex-col items-center justify-center h-40 p-6">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No channels configured</p>
                  <p className="text-sm text-muted-foreground">Add a channel to start monitoring for harmful content</p>
                </CardContent>
              </Card>
            ) : (
              channels.map((channel) => (
                <Card key={channel.id} className="bg-white dark:bg-gray-800 shadow-md border-none">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      {platformIcons[channel.platform]}
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={channel.monitoringEnabled}
                        onCheckedChange={(checked) => toggleChannelMonitoring(channel.id, checked)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {channel.monitoringEnabled ? "Monitoring" : "Paused"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Platform:</span>
                        <span className="text-sm font-medium">{channel.platform}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Channel ID:</span>
                        <span className="text-sm font-medium">{channel.channelId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Auto-remove:</span>
                        <span className="text-sm font-medium">
                          {channel.moderationSettings.autoRemove ? (
                            <Badge variant="success" className="bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" />
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <X className="mr-1 h-3 w-3" />
                              Disabled
                            </Badge>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Threshold:</span>
                        <span className="text-sm font-medium">{channel.moderationSettings.autoRemoveThreshold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Categories:</span>
                        <div className="flex flex-wrap justify-end gap-1">
                          {channel.moderationSettings.categories.map((category) => (
                            <Badge key={category} variant="outline" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Dialog
                      open={isEditDialogOpen && editingChannel?.id === channel.id}
                      onOpenChange={(open) => {
                        setIsEditDialogOpen(open)
                        if (!open) setEditingChannel(null)
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setEditingChannel(channel)}>
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Edit Channel</DialogTitle>
                          <DialogDescription>Update channel monitoring settings.</DialogDescription>
                        </DialogHeader>
                        {editingChannel && (
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-name" className="text-right">
                                Name
                              </Label>
                              <Input
                                id="edit-name"
                                value={editingChannel.name}
                                onChange={(e) => setEditingChannel({ ...editingChannel, name: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-platform" className="text-right">
                                Platform
                              </Label>
                              <Select
                                value={editingChannel.platform}
                                onValueChange={(value) =>
                                  setEditingChannel({ ...editingChannel, platform: value as Platform })
                                }
                              >
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Twitter">Twitter</SelectItem>
                                  <SelectItem value="Reddit">Reddit</SelectItem>
                                  <SelectItem value="Facebook">Facebook</SelectItem>
                                  <SelectItem value="Instagram">Instagram</SelectItem>
                                  <SelectItem value="YouTube">YouTube</SelectItem>
                                  <SelectItem value="TikTok">TikTok</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-channelId" className="text-right">
                                Channel ID
                              </Label>
                              <Input
                                id="edit-channelId"
                                value={editingChannel.channelId}
                                onChange={(e) => setEditingChannel({ ...editingChannel, channelId: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-monitoring" className="text-right">
                                Monitoring
                              </Label>
                              <div className="flex items-center space-x-2 col-span-3">
                                <Switch
                                  id="edit-monitoring"
                                  checked={editingChannel.monitoringEnabled}
                                  onCheckedChange={(checked) =>
                                    setEditingChannel({ ...editingChannel, monitoringEnabled: checked })
                                  }
                                />
                                <Label htmlFor="edit-monitoring">Enable monitoring</Label>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-autoRemove" className="text-right">
                                Auto-remove
                              </Label>
                              <div className="flex items-center space-x-2 col-span-3">
                                <Switch
                                  id="edit-autoRemove"
                                  checked={editingChannel.moderationSettings.autoRemove}
                                  onCheckedChange={(checked) =>
                                    setEditingChannel({
                                      ...editingChannel,
                                      moderationSettings: {
                                        ...editingChannel.moderationSettings,
                                        autoRemove: checked,
                                      },
                                    })
                                  }
                                />
                                <Label htmlFor="edit-autoRemove">
                                  Automatically remove high-confidence harmful content
                                </Label>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="edit-threshold" className="text-right">
                                Threshold
                              </Label>
                              <div className="col-span-3 space-y-2">
                                <Slider
                                  id="edit-threshold"
                                  defaultValue={[editingChannel.moderationSettings.autoRemoveThreshold]}
                                  max={1}
                                  min={0.5}
                                  step={0.01}
                                  onValueChange={(value) =>
                                    setEditingChannel({
                                      ...editingChannel,
                                      moderationSettings: {
                                        ...editingChannel.moderationSettings,
                                        autoRemoveThreshold: value[0],
                                      },
                                    })
                                  }
                                />
                                <div className="flex justify-between">
                                  <span className="text-xs">0.5</span>
                                  <span className="text-xs font-medium">
                                    {editingChannel.moderationSettings.autoRemoveThreshold}
                                  </span>
                                  <span className="text-xs">1.0</span>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 items-start gap-4">
                              <Label htmlFor="edit-categories" className="text-right pt-2">
                                Categories
                              </Label>
                              <div className="col-span-3 space-y-2">
                                {[
                                  "Hate Speech",
                                  "Misinformation",
                                  "Cyberbullying",
                                  "Harassment",
                                  "Self-harm",
                                  "Threats",
                                ].map((category) => (
                                  <div key={category} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`edit-category-${category}`}
                                      checked={editingChannel.moderationSettings.categories.includes(
                                        category as ContentCategory,
                                      )}
                                      onCheckedChange={(checked) => {
                                        const currentCategories = editingChannel.moderationSettings.categories
                                        const updatedCategories = checked
                                          ? [...currentCategories, category as ContentCategory]
                                          : currentCategories.filter((c) => c !== category)

                                        setEditingChannel({
                                          ...editingChannel,
                                          moderationSettings: {
                                            ...editingChannel.moderationSettings,
                                            categories: updatedCategories,
                                          },
                                        })
                                      }}
                                    />
                                    <Label htmlFor={`edit-category-${category}`}>{category}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateChannel}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Trash className="mr-1 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified about content moderation events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-critical">Critical Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for critical severity content
                      </p>
                    </div>
                    <Switch id="email-critical" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-high">High Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for high severity content
                      </p>
                    </div>
                    <Switch id="email-high" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-medium">Medium Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email notifications for medium severity content
                      </p>
                    </div>
                    <Switch id="email-medium" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-digest">Daily Digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a daily summary of moderation activity</p>
                    </div>
                    <Switch id="email-digest" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-critical">Critical Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notifications for critical severity content
                      </p>
                    </div>
                    <Switch id="app-critical" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-high">High Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notifications for high severity content
                      </p>
                    </div>
                    <Switch id="app-high" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-medium">Medium Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notifications for medium severity content
                      </p>
                    </div>
                    <Switch id="app-medium" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-low">Low Severity Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Show in-app notifications for low severity content
                      </p>
                    </div>
                    <Switch id="app-low" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Webhook Notifications</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                      <p className="text-sm text-muted-foreground">Send webhook notifications for moderation events</p>
                    </div>
                    <Switch id="webhook-enabled" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhook-url">Webhook URL</Label>
                    <Input id="webhook-url" placeholder="https://example.com/webhook" />
                    <p className="text-xs text-muted-foreground">
                      Enter the URL where webhook notifications should be sent
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>AI Moderation Thresholds</CardTitle>
              <CardDescription>Configure confidence thresholds for AI-powered content moderation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Global Thresholds</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="auto-remove-threshold">Auto-remove Threshold</Label>
                      <span className="text-sm font-medium">0.92</span>
                    </div>
                    <Slider id="auto-remove-threshold" defaultValue={[0.92]} max={1} min={0.5} step={0.01} />
                    <p className="text-xs text-muted-foreground">
                      Content with confidence scores above this threshold will be automatically removed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="flag-threshold">Flag for Review Threshold</Label>
                      <span className="text-sm font-medium">0.75</span>
                    </div>
                    <Slider id="flag-threshold" defaultValue={[0.75]} max={1} min={0.5} step={0.01} />
                    <p className="text-xs text-muted-foreground">
                      Content with confidence scores above this threshold will be flagged for human review
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Category-specific Thresholds</h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="hate-speech-threshold">Hate Speech</Label>
                      <span className="text-sm font-medium">0.85</span>
                    </div>
                    <Slider id="hate-speech-threshold" defaultValue={[0.85]} max={1} min={0.5} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="misinfo-threshold">Misinformation</Label>
                      <span className="text-sm font-medium">0.88</span>
                    </div>
                    <Slider id="misinfo-threshold" defaultValue={[0.88]} max={1} min={0.5} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="cyberbullying-threshold">Cyberbullying</Label>
                      <span className="text-sm font-medium">0.82</span>
                    </div>
                    <Slider id="cyberbullying-threshold" defaultValue={[0.82]} max={1} min={0.5} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="harassment-threshold">Harassment</Label>
                      <span className="text-sm font-medium">0.80</span>
                    </div>
                    <Slider id="harassment-threshold" defaultValue={[0.8]} max={1} min={0.5} step={0.01} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="selfharm-threshold">Self-harm</Label>
                      <span className="text-sm font-medium">0.90</span>
                    </div>
                    <Slider id="selfharm-threshold" defaultValue={[0.9]} max={1} min={0.5} step={0.01} />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Threshold Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <Card className="bg-white dark:bg-gray-800 shadow-md border-none">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Profile Information</h3>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" defaultValue="Demo User" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" defaultValue="demo@example.com" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Security</h3>
                <div className="space-y-2">
                  <Button variant="outline">Change Password</Button>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="multiple-sessions">Allow Multiple Sessions</Label>
                      <p className="text-sm text-muted-foreground">Allow multiple active sessions for your account</p>
                    </div>
                    <Switch id="multiple-sessions" defaultChecked={false} />
                  </div>
                  <Button variant="outline">Sign Out All Other Devices</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Data & Privacy</h3>
                <div className="space-y-2">
                  <Button variant="outline">Export My Data</Button>
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">Save Account Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

