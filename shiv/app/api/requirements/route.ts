import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { userId, content } = await req.json()
  // Here, call your extraction model and get the result
  // const extractionResult = await callYourModel(content)
  const requirement = await prisma.requirement.create({
    data: { userId, content }
  })
  return NextResponse.json({ requirement })
}