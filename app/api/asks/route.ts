import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/prisma'

type Body = {
  flowType: 'personal' | 'business'
  didAsk: 'yes' | 'no'
  cardStatus: 'hasCard' | 'noCard' | null
}

function mapFlowType(v: Body['flowType']) {
  return v === 'personal' ? 'PERSONAL' : 'BUSINESS'
}

function mapYesNo(v: Body['didAsk']) {
  return v === 'yes' ? 'YES' : 'NO'
}

function mapCardStatus(v: Body['cardStatus']) {
  if (!v) return null
  return v === 'hasCard' ? 'HAS_CARD' : 'NO_CARD'
}

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
    const decoded = await adminAuth.verifyIdToken(idToken)

    const firebaseUid = decoded.uid
    if (!firebaseUid) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token (missing uid)' },
        { status: 401 }
      )
    }

    const body = (await req.json()) as Body

    // Basic validation
    if (!body?.flowType || !body?.didAsk) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // If they didAsk === 'yes', cardStatus must be null
    // If didAsk === 'no', cardStatus must be present
    if (body.didAsk === 'yes' && body.cardStatus !== null) {
      return NextResponse.json(
        { ok: false, error: 'cardStatus must be null when didAsk is yes' },
        { status: 400 }
      )
    }

    if (body.didAsk === 'no' && !body.cardStatus) {
      return NextResponse.json(
        { ok: false, error: 'cardStatus required when didAsk is no' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found. Sync user first.' },
        { status: 404 }
      )
    }

    const created = await prisma.ask.create({
      data: {
        userId: user.id,
        flowType: mapFlowType(body.flowType),
        didAsk: mapYesNo(body.didAsk),
        cardStatus:
          body.didAsk === 'no' ? mapCardStatus(body.cardStatus) : null,
      },
    })

    return NextResponse.json({ ok: true, ask: created }, { status: 201 })
  } catch (err: unknown) {
    // If verifyIdToken fails etc.
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
