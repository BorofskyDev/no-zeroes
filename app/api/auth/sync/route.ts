// app/api/auth/sync/route.ts
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
      create: {
        firebaseUid,
        email,
        // role defaults to USER in schema; keep it that way
      },
      update: {
        // Keep this light—don’t overwrite profile fields every login unless you want that behavior
        ...(email ? { email } : {}),
      },
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    })

    return NextResponse.json({ ok: true, user })
  } catch (err: unknown) {
    // Common cases:
    // - auth/id-token-expired
    // - auth/argument-error (malformed token)
    // - auth/invalid-id-token
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 401 })
  }
}
