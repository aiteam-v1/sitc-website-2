import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const payload = await getPayload({ config })

    if (!payload.db) {
      return NextResponse.json(
        { status: 'error', db: 'unavailable' },
        { status: 503 },
      )
    }

    const connect = payload.db?.connect

    if (!connect) {
      return NextResponse.json(
        { status: 'error', db: 'unavailable' },
        { status: 503 },
      )
    }

    await connect.call(payload.db)
    return NextResponse.json({ status: 'ok', db: 'connected' })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected' },
      { status: 503 },
    )
  }
}
