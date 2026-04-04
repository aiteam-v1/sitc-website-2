import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.db.connect()
    return NextResponse.json({ status: 'ok', db: 'connected' })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 },
    )
  }
}
