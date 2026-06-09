import { NextResponse } from 'next/server'
import { getSeedData, runSeed } from '@/lib/news-seed'

export async function GET() {
  return NextResponse.json({
    message: 'Seed atual carregado.',
    data: getSeedData()
  })
}

export async function POST() {
  const data = runSeed()

  return NextResponse.json(
    {
      message: 'Seed executado com sucesso.',
      data
    },
    { status: 201 }
  )
}
