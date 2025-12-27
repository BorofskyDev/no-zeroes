// app/api/auth/sync/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const authHeader =
      req.headers.get('authorization') || req.headers.get('Authorization')

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid Authorization header' },
        { status: 401 }
      )
    }

    const idToken = authHeader.slice('Bearer '.length).trim()
    if (!idToken) {
      return NextResponse.json(
        { ok: false, error: 'Missing token' },
        { status: 401 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(idToken)

    const firebaseUid = decoded.uid
    const email = decoded.email ?? null

    const user = await prisma.user.upsert({
      where: { firebaseUid },
      create: { firebaseUid, email },
      update: { ...(email ? { email } : {}) },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    })

    return NextResponse.json({ ok: true, user }, { status: 200 })
  } catch (err: unknown) {
    // Log the real error server-side so you can see it in the terminal
    if (process.env.NODE_ENV !== 'production') {
      console.error('[/api/auth/sync] Error:', err)
    }

    const message = err instanceof Error ? err.message : 'Unknown error'

    // Treat Firebase token problems as 401; everything else 500
    const isAuthError =
      typeof message === 'string' &&
      (message.toLowerCase().includes('token') ||
        message.toLowerCase().includes('auth/') ||
        message.toLowerCase().includes('id token'))

    return NextResponse.json(
      { ok: false, error: message },
      { status: isAuthError ? 401 : 500 }
    )
  }
}
