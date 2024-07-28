import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const classParam = searchParams.get('class')
  const specParam = searchParams.get('spec')

  if (!classParam || !specParam) {
    return NextResponse.json(
      { error: 'Missing class or spec parameter' },
      { status: 400 },
    )
  }

  try {
    const classSpec = `${specParam}-${classParam}`

    const characters = await prisma.character.findMany({
      where: { classSpec },
      orderBy: { updatedAt: 'desc' },
      take: 3,
    })

    const archonData = await prisma.archonGear.findMany({
      where: { classSpec },
      orderBy: { updatedAt: 'desc' },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ characters, archonData })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
