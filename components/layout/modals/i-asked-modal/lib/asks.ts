'use client'

import { getAuth } from 'firebase/auth'

export type CreateAskInput = {
  flowType: 'personal' | 'business'
  didAsk: 'yes' | 'no'
  cardStatus: 'hasCard' | 'noCard' | null
}

export async function createAsk(input: CreateAskInput) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('Not authenticated')

  const idToken = await user.getIdToken()

  const res = await fetch('/api/asks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(input),
  })

  const data = await res.json()
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || 'Failed to create ask')
  }

  return data.ask
}
