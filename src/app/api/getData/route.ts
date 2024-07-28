import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const className = searchParams.get('class')
  const classSpec = searchParams.get('spec')

  if (!className || !classSpec) {
    return NextResponse.json(
      { error: 'Missing class or spec parameter' },
      { status: 400 },
    )
  }

  try {
    const characters = await prisma.character.findMany({
      where: {
        // @ts-ignore
        className: className,
        classSpec: classSpec,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 3,
    })

    const archonData = await prisma.archonGear.findMany({
      where: {
        // @ts-ignore
        className: className,
        classSpec: classSpec,
      },
      orderBy: {
        updatedAt: 'desc',
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
