import { NextRequest, NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST(_request: NextRequest): Promise<NextResponse<null>> {
  deleteSession()
  return new NextResponse(null, { status: 204 })
}
