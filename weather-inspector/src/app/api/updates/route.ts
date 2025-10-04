import { NextResponse } from 'next/server'
import { getUpdates } from '@/lib/cases.server'

export async function GET(request: Request) {
  const updates = await getUpdates()
  return NextResponse.json(updates)
}
