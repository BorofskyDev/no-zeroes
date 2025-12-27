// lib/firebase/admin.ts
import { getApps, initializeApp, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

function getFirebaseAdminApp(): App {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin env vars. Required: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY'
    )
  }

  // Firebase private keys in env vars often have escaped newlines
  const normalizedPrivateKey = privateKey.replace(/\\n/g, '\n')

  if (getApps().length) return getApps()[0]!

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: normalizedPrivateKey,
    }),
  })
}

export const adminApp = getFirebaseAdminApp()
export const adminAuth = getAuth(adminApp)
