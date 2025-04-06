"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Check,
  MessageSquare,
  Search,
  ThumbsDown,
  ThumbsUp,
  X,
  Info,
  AlertCircle,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { FlaggedContent } from "@/lib/schemas/content-types"
import { getMockFlaggedContent, reviewMockContent } from "@/lib/services/mock-data-service"

interface ContentFeedProps {
  userId: string
}

// Platform icon component
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "twitter":
      return <Twitter className="h-4 w-4 text-[#1da1f2]" />
    case "facebook":
      return <Facebook className="h-4 w-4 text-[#4267B2]" />
    case "instagram":
      return <Instagram className="h-4 w-4 text-[#C13584]" />
    case "youtube":
      return <Youtube className="h-4 w-4 text-[#FF0000]" />
    case "reddit":
      return (
        <svg className="h-4 w-4 text-[#ff4500]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      )
    case "tiktok":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    default:
      return <div className="h-4 w-4 rounded-full bg-gray-500" />
  }
}

export function ContentFeed({ userId }: ContentFeedProps) {
  const [items, setItems] = useState<FlaggedContent[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewHistory, setReviewHistory] = useState<{
    approved: FlaggedContent[]
    removed: FlaggedContent[]
  }>({
    approved: [],
    removed: [],
  })

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getMockFlaggedContent(userId)
        setItems(data)
      } catch (error) {
        console.error("Error fetching flagged content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [userId])

  const handleAction = async (id: string, action: "approve" | "remove") => {
    const item = items.find((item) => item.id === id)
    if (!item) return

    try {
      // In a real app, this would call your API
      await reviewMockContent(id, action, userId)

      if (action === "approve") {
        setReviewHistory((prev) => ({
          ...prev,
          approved: [...prev.approved, item],
        }))
      } else {
        setReviewHistory((prev) => ({
          ...prev,
          removed: [...prev.removed, item],
        }))
      }

      setItems(items.filter((item) => item.id !== id))
    } catch (error) {
      console.error("Error reviewing content:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-[600px]">Loading content...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search content..." className="pl-8" />
        </div>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="hate">Hate Speech</SelectItem>
              <SelectItem value="misinfo">Misinformation</SelectItem>
              <SelectItem value="bully">Cyberbullying</SelectItem>
              <SelectItem value="harass">Harassment</SelectItem>
              <SelectItem value="selfharm">Self-harm</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="bg-white dark:bg-gray-800 shadow-md">
          <TabsTrigger value="pending">Pending Review ({items.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({reviewHistory.approved.length})</TabsTrigger>
          <TabsTrigger value="removed">Removed ({reviewHistory.removed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-4 pt-4">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-white dark:bg-gray-800 shadow-md border-none">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar} alt={item.username} />
                        <AvatarFallback>{item.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium flex items-center">
                            <PlatformIcon platform={item.platform} />
                            <span className="ml-1">
                              {item.platform} - @{item.username}
                            </span>
                          </span>
                          <Badge
                            variant={
                              item.severity === "Critical"
                                ? "destructive"
                                : item.severity === "High"
                                  ? "default"
                                  : "outline"
                            }
                            className={
                              item.severity === "Critical"
                                ? "bg-red-500"
                                : item.severity === "High"
                                  ? "bg-orange-500"
                                  : ""
                            }
                          >
                            {item.severity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`bg-${item.category.toLowerCase().replace(" ", "")}-light text-${item.category.toLowerCase().replace(" ", "")}`}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {typeof item.timestamp === "string" ? item.timestamp : item.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2 text-sm">{item.content}</p>

                        <div className="mt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium mr-2">AI Confidence:</span>
                              <Progress value={item.confidence * 100} className="w-32 h-2 progress-animate" />
                              <span className="ml-2 text-sm">{(item.confidence * 100).toFixed(0)}%</span>
                            </div>
                            <Badge
                              variant={item.aiDecision === "Remove" ? "destructive" : "outline"}
                              className={`ml-2 ${item.aiDecision === "Remove" ? "bg-red-500" : item.aiDecision === "Flag for Review" ? "bg-orange-500" : ""}`}
                            >
                              AI Decision: {item.aiDecision}
                            </Badge>
                          </div>

                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="explanation">
                              <AccordionTrigger className="text-sm py-2">
                                <div className="flex items-center">
                                  <Info className="h-4 w-4 mr-2" />
                                  AI Explanation
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="text-sm space-y-2 p-2 bg-muted/30 rounded-md">
                                  <p>{item.explanation}</p>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {item.keywords.map((keyword, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">Human review required</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAction(item.id, "approve")}
                              className="border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
                            >
                              <ThumbsUp className="mr-1 h-3.5 w-3.5" />
                              Approve Content
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleAction(item.id, "remove")}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              <ThumbsDown className="mr-1 h-3.5 w-3.5" />
                              Remove Content
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="approved" className="pt-4">
          {reviewHistory.approved.length > 0 ? (
            <div className="space-y-4">
              {reviewHistory.approved.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-green-200 bg-green-50 dark:bg-green-900 dark:border-green-700 shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar} alt={item.username} />
                        <AvatarFallback>{item.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium flex items-center">
                            <PlatformIcon platform={item.platform} />
                            <span className="ml-1">
                              {item.platform} - @{item.username}
                            </span>
                          </span>
                          <Badge
                            variant="outline"
                            className={`bg-${item.category.toLowerCase().replace(" ", "")}-light text-${item.category.toLowerCase().replace(" ", "")}`}
                          >
                            {item.category}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                          >
                            <Check className="mr-1 h-3.5 w-3.5" />
                            Approved (Override AI)
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm">{item.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No approved content</h3>
                <p className="mt-2 text-sm text-muted-foreground">Approved content will appear here</p>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="removed" className="pt-4">
          {reviewHistory.removed.length > 0 ? (
            <div className="space-y-4">
              {reviewHistory.removed.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-red-200 bg-red-50 dark:bg-red-900 dark:border-red-700 shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={item.avatar} alt={item.username} />
                        <AvatarFallback>{item.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium flex items-center">
                            <PlatformIcon platform={item.platform} />
                            <span className="ml-1">
                              {item.platform} - @{item.username}
                            </span>
                          </span>
                          <Badge
                            variant="outline"
                            className={`bg-${item.category.toLowerCase().replace(" ", "")}-light text-${item.category.toLowerCase().replace(" ", "")}`}
                          >
                            {item.category}
                          </Badge>
                          <Badge variant="destructive" className="bg-red-500 dark:bg-red-700">
                            <X className="mr-1 h-3.5 w-3.5" />
                            Removed
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm">{item.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <div className="flex flex-col items-center text-center">
                <ThumbsDown className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No removed content</h3>
                <p className="mt-2 text-sm text-muted-foreground">Removed content will appear here</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

