import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

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
    const [characters, archonData, whBestGear] = await Promise.all([
      prisma.character.findMany({
        where: {
          // @ts-ignore
          className: className,
          classSpec: classSpec,
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 3,
      }),
      prisma.archonGear.findMany({
        where: {
          // @ts-ignore
          className: className,
          classSpec: classSpec,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      }),
      prisma.whBestGear.findMany({
        where: {
          className: className,
          classSpec: classSpec,
        },
        orderBy: {
          itemSlot: 'desc',
        },
      }),
    ])

    return NextResponse.json({ characters, archonData, whBestGear })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
