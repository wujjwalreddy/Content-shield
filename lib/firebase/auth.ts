import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth"
import { auth, db } from "./config"
import { setCookie, removeCookie } from "./cookies"
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"

// Track active sessions to prevent multiple logins
export async function signUp(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update the user profile with the display name
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName,
      })
    }

    // Create a user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      activeSession: true,
      sessionId: generateSessionId(),
      role: "pending", // New users start as pending
      approved: false, // New users need approval
      teams: [], // No teams assigned yet
    })

    // Set a session cookie
    const token = await userCredential.user.getIdToken()
    const sessionId = generateSessionId()
    setCookie("session", token, 14) // 14 days
    setCookie("sessionId", sessionId, 14) // 14 days

    return userCredential.user
  } catch (error) {
    console.error("Error signing up:", error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await firebaseSignIn(auth, email, password)

    // Check if user already has an active session
    const userDocRef = doc(db, "users", userCredential.user.uid)
    const userDoc = await getDoc(userDocRef)
    const sessionId = generateSessionId()

    if (userDoc.exists()) {
      const userData = userDoc.data()

      // Check if user is approved
      if (userData.role === "pending" && !userData.approved) {
        await firebaseSignOut(auth)
        throw new Error("Your account is pending approval by an administrator.")
      }

      // Update existing user document
      await updateDoc(userDocRef, {
        lastLogin: serverTimestamp(),
        activeSession: true,
        sessionId: sessionId,
      })
    } else {
      // Create new user document
      await setDoc(userDocRef, {
        email: userCredential.user.email,
        displayName: userCredential.user.displayName || "User",
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        activeSession: true,
        sessionId: sessionId,
        role: "pending", // Default role for new users
        approved: false, // Default approval status
        teams: [], // No teams assigned yet
      })
    }

    // Set a session cookie
    const token = await userCredential.user.getIdToken()
    setCookie("session", token, 14) // 14 days
    setCookie("sessionId", sessionId, 14) // 14 days

    return userCredential.user
  } catch (error) {
    console.error("Error signing in:", error)
    throw error
  }
}

export async function signOut() {
  try {
    if (auth.currentUser) {
      // Update user document to mark session as inactive
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        activeSession: false,
        sessionId: null,
      })
    }

    await firebaseSignOut(auth)
    removeCookie("session")
    removeCookie("sessionId")
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

// Force sign out from previous session
async function forceSignOutPreviousSession(userId: string) {
  try {
    await updateDoc(doc(db, "users", userId), {
      activeSession: false,
      sessionId: null,
      forcedSignOut: true,
      forcedSignOutAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error forcing sign out:", error)
    throw error
  }
}

// Check if current session is valid
export async function validateSession() {
  try {
    if (!auth.currentUser) return false

    const sessionId = getCookie("sessionId")
    if (!sessionId) return false

    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))

    if (!userDoc.exists()) return false

    const userData = userDoc.data()

    // If session IDs don't match or session is inactive, force sign out
    if (!userData.activeSession || userData.sessionId !== sessionId) {
      await signOut()
      return false
    }

    // Check if user is approved
    if (userData.role === "pending" && !userData.approved) {
      await signOut()
      return false
    }

    return true
  } catch (error) {
    console.error("Error validating session:", error)
    return false
  }
}

// Generate a random session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Get cookie helper
function getCookie(name: string) {
  if (typeof document === "undefined") return null

  const nameEQ = name + "="
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === " ") c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

// Set up auth state listener to validate session on changes
export function setupAuthListener() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const isValid = await validateSession()
      if (!isValid) {
        // Redirect to login page or show a message
        window.location.href = "/login?session=expired"
      }
    }
  })
}

