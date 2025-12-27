import { NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/prisma'

function getBearerToken(req: Request) {
  const h = req.headers.get('authorization') || req.headers.get('Authorization')
  if (!h?.startsWith('Bearer ')) return null
  return h.slice('Bearer '.length).trim()
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getBearerToken(req)
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = await adminAuth.verifyIdToken(token)
    const firebaseUid = decoded.uid

    const user = await prisma.user.findUnique({
      where: { firebaseUid },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Ensure the ask belongs to the user (prevents deleting others’ records)
    const ask = await prisma.ask.findUnique({
      where: { id: params.id },
      select: { id: true, userId: true },
    })

    if (!ask || ask.userId !== user.id) {
      return NextResponse.json(
        { ok: false, error: 'Not found' },
        { status: 404 }
      )
    }

    await prisma.ask.delete({ where: { id: params.id } })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
