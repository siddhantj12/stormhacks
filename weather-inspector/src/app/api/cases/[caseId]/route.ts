import { NextResponse } from 'next/server'
import { getCaseServer, updateCase } from '@/lib/cases.server'

export async function GET(
  request: Request,
  { params }: { params: { caseId: string } }
) {
  const { caseId } = params
  const c = await getCaseServer(caseId)
  return NextResponse.json(c)
}

export async function PUT(
  request: Request,
  { params }: { params: { caseId: string } }
) {
  const { caseId } = params
  const body = await request.json()
  const c = await updateCase(caseId, body)
  return NextResponse.json(c)
}
