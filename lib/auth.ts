import { cookies } from "next/headers"
import { mockUsers } from "@/lib/services/mock-user-service"
import type { UserRole } from "@/lib/schemas/user-types"

export async function getServerSession() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")?.value
    const sessionId = cookieStore.get("sessionId")?.value

    if (!sessionCookie || !sessionId) {
      return null
    }

    // In a real app, you would verify the session token with Firebase Admin SDK
    // For demo purposes, we're returning a mock user with only serializable properties
    // Find the first admin user from our mock data
    const adminUser = mockUsers.find((user) => user.role === "admin" && user.approved)

    if (!adminUser) {
      return null
    }

    return {
      user: {
        uid: adminUser.uid,
        email: adminUser.email,
        displayName: adminUser.displayName,
        photoURL: adminUser.photoURL,
        role: adminUser.role,
        approved: adminUser.approved,
      },
    }

    // Uncomment this code when you have Firebase Admin SDK set up
    /*
    const admin = getFirebaseAdmin();
    
    // Verify the session cookie
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    
    // Get the user from Firestore to check session validity
    const userDoc = await admin.firestore().collection('users').doc(decodedClaims.uid).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const userData = userDoc.data();
    
    // Check if session is active and IDs match
    if (!userData.activeSession || userData.sessionId !== sessionId) {
      return null;
    }
    
    // Get the user from Firebase Auth
    const user = await admin.auth().getUser(decodedClaims.uid);
    
    // Return only serializable properties
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: userData.role || 'moderator',
        approved: userData.approved || false,
      }
    };
    */
  } catch (error) {
    console.error("Error getting server session:", error)
    return null
  }
}

export async function checkUserRole(requiredRole: UserRole) {
  const session = await getServerSession()

  if (!session) {
    return false
  }

  // @ts-ignore - we know role exists in our extended user object
  const userRole = session.user.role

  if (requiredRole === "admin") {
    return userRole === "admin"
  }

  if (requiredRole === "moderator") {
    return userRole === "admin" || userRole === "moderator"
  }

  return true
}

