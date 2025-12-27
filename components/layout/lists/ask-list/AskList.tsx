'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heading, PrimaryBtn } from '@/components'
import {
  AskDto,
  deleteAsk,
  getAsks,
} from '@/components/layout/modals/i-asked-modal/lib/asks'
import styles from './AskList.module.scss'

const EDIT_WINDOW_MS = 5 * 60 * 1000

function formatEnum(v: string) {
  return v.replaceAll('_', ' ').toLowerCase()
}

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '0:00'
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export const AskList = () => {
  const [asks, setAsks] = useState<AskDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0) // forces “time left” to update

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        setLoading(true)
        const data = await getAsks()
        if (mounted) setAsks(data)
      } catch (e: unknown) {
        if (mounted) setError(e instanceof Error ? e.message : 'Failed to load entries')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  // update the countdown display every second
  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await deleteAsk(id)
      setAsks((prev) => prev.filter((a) => a.id !== id))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete entry')
    }
  }

  if (loading) return <div className={styles.state}>Loading…</div>
  if (error) return <div className={styles.stateError}>{error}</div>
  if (!asks.length) return <div className={styles.state}>No entries yet.</div>

  return (
    <div className={styles.list}>
        <Heading as='h2' size='section'>Asks</Heading>
      {asks.map((a) => {
        const createdMs = new Date(a.createdAt).getTime()
        const expiresMs = createdMs + EDIT_WINDOW_MS
        const timeLeftMs = expiresMs - Date.now()
        const canEdit = timeLeftMs > 0

        return (
          <div key={a.id} className={styles.card}>
            <div className={styles.metaRow}>
              <div className={styles.time}>
                {canEdit ? (
                  <>
                    <span className={styles.badge}>Editable</span>
                    <span className={styles.mono}>
                      {formatTimeLeft(timeLeftMs)}
                    </span>
                  </>
                ) : (
                  <span className={styles.badgeMuted}>Locked</span>
                )}
              </div>

              <PrimaryBtn
                variant='delete'
                type='button'
                onClick={() => handleDelete(a.id)}
              >
                Delete
              </PrimaryBtn>
            </div>

            <div className={styles.details}>
              <div>
                <strong>Type:</strong> {formatEnum(a.flowType)}
              </div>
              <div>
                <strong>Asked:</strong> {formatEnum(a.didAsk)}
              </div>
              {a.didAsk === 'NO' ? (
                <div>
                  <strong>Card:</strong>{' '}
                  {a.cardStatus ? formatEnum(a.cardStatus) : '-'}
                </div>
              ) : null}
              <div className={styles.createdAt}>
                {new Date(a.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
