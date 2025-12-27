import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'

type SyncedUser = {
  id: string
  firebaseUid: string
  email: string | null
  role: 'SUPERUSER' | 'ADMIN' | 'USER'
  firstName: string | null
  lastName: string | null
}

type SyncResponse =
  | { ok: true; user: SyncedUser }
  | { ok: false; error: string }

export async function loginAndSyncWithEmail(email: string, password: string) {
  // 1) Firebase sign-in
  const cred: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )

  // 2) Token
  const token = await cred.user.getIdToken()

  // 3) Sync to Prisma
  const res = await fetch('/api/auth/sync', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })

  const data = (await res.json()) as SyncResponse

  if (!res.ok || !data.ok) {
    const msg = 'error' in data ? data.error : 'Sync failed'
    throw new Error(msg)
  }

  return data.user
}
