import { db } from "@/lib/firebase/config"
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  orderBy,
  limit,
  Timestamp,
  deleteDoc,
} from "firebase/firestore"
import type {
  FlaggedContent,
  ModeratorActivity,
  Alert,
  MonitoredChannel,
  ContentStats,
  AnalyticsData,
} from "@/lib/schemas/content-types"

// Helper function to convert Firestore timestamps to Date objects
const convertTimestamps = (obj: any) => {
  const result = { ...obj }
  Object.keys(result).forEach((key) => {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate()
    } else if (typeof result[key] === "object" && result[key] !== null) {
      result[key] = convertTimestamps(result[key])
    }
  })
  return result
}

// Get flagged content for a specific user
export async function getFlaggedContent(userId: string, limit = 10): Promise<FlaggedContent[]> {
  try {
    const q = query(
      collection(db, "flaggedContent"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limit),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as FlaggedContent
    })
  } catch (error) {
    console.error("Error getting flagged content:", error)
    throw error
  }
}

// Get recent alerts for a specific user
export async function getRecentAlerts(userId: string, limit = 4): Promise<Alert[]> {
  try {
    const q = query(collection(db, "alerts"), where("userId", "==", userId), orderBy("timestamp", "desc"), limit(limit))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as Alert
    })
  } catch (error) {
    console.error("Error getting recent alerts:", error)
    throw error
  }
}

// Get moderator activity for a specific user
export async function getModeratorActivity(userId: string, limit = 5): Promise<ModeratorActivity[]> {
  try {
    const q = query(
      collection(db, "moderatorActivity"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limit),
    )

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as ModeratorActivity
    })
  } catch (error) {
    console.error("Error getting moderator activity:", error)
    throw error
  }
}

// Get content stats for a specific user
export async function getContentStats(userId: string): Promise<ContentStats> {
  try {
    const docRef = doc(db, "contentStats", userId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return convertTimestamps(docSnap.data()) as ContentStats
    } else {
      throw new Error("Content stats not found")
    }
  } catch (error) {
    console.error("Error getting content stats:", error)
    throw error
  }
}

// Get analytics data for a specific user
export async function getAnalyticsData(
  userId: string,
  timeRange: "day" | "week" | "month" | "year",
): Promise<AnalyticsData> {
  try {
    const q = query(
      collection(db, "analytics"),
      where("userId", "==", userId),
      where("timeRange", "==", timeRange),
      limit(1),
    )

    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data()
      return {
        id: querySnapshot.docs[0].id,
        ...convertTimestamps(data),
      } as unknown as AnalyticsData
    } else {
      throw new Error("Analytics data not found")
    }
  } catch (error) {
    console.error("Error getting analytics data:", error)
    throw error
  }
}

// Get monitored channels for a specific user
export async function getMonitoredChannels(userId: string): Promise<MonitoredChannel[]> {
  try {
    const q = query(collection(db, "monitoredChannels"), where("userId", "==", userId))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        ...convertTimestamps(data),
      } as MonitoredChannel
    })
  } catch (error) {
    console.error("Error getting monitored channels:", error)
    throw error
  }
}

// Add a new monitored channel
export async function addMonitoredChannel(channel: Omit<MonitoredChannel, "id">): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "monitoredChannels"), channel)
    return docRef.id
  } catch (error) {
    console.error("Error adding monitored channel:", error)
    throw error
  }
}

// Update a monitored channel
export async function updateMonitoredChannel(id: string, channel: Partial<MonitoredChannel>): Promise<void> {
  try {
    const docRef = doc(db, "monitoredChannels", id)
    await updateDoc(docRef, channel)
  } catch (error) {
    console.error("Error updating monitored channel:", error)
    throw error
  }
}

// Delete a monitored channel
export async function deleteMonitoredChannel(id: string): Promise<void> {
  try {
    const docRef = doc(db, "monitoredChannels", id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting monitored channel:", error)
    throw error
  }
}

// Review flagged content
export async function reviewContent(
  contentId: string,
  decision: "approve" | "remove",
  moderatorId: string,
): Promise<void> {
  try {
    const docRef = doc(db, "flaggedContent", contentId)
    const contentSnap = await getDoc(docRef)

    if (!contentSnap.exists()) {
      throw new Error("Content not found")
    }

    const content = contentSnap.data() as FlaggedContent

    // Update the content with the review decision
    await updateDoc(docRef, {
      reviewedBy: moderatorId,
      reviewedAt: new Date(),
      reviewDecision: decision,
    })

    // Add moderator activity
    await addDoc(collection(db, "moderatorActivity"), {
      moderatorId,
      moderator: "Current User", // This would be replaced with the actual moderator name
      action: decision === "approve" ? "Approved" : "Removed",
      content: content.content.substring(0, 50) + "...",
      contentId,
      timestamp: new Date(),
      userId: content.userId, // Maintain the same userId for data segregation
    })
  } catch (error) {
    console.error("Error reviewing content:", error)
    throw error
  }
}

