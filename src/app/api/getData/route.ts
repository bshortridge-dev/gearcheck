import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

// Define the interface for your items
interface Item {
  categoryName: string
  popularity: string // Popularity is stored as a string
  // Add other properties as needed
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  // Helper function to transform parameters
  const transformParam = (param: string | null): string | undefined => {
    if (param === null) return undefined
    return param.toLowerCase().replace(/\s+/g, '-')
  }

  const className = transformParam(searchParams.get('class'))
  const classSpec = transformParam(searchParams.get('spec'))

  try {
    const [
      characters,
      archonData,
      whBestGear,
      rings,
      trinkets,
      allItems,
      enchantData, // Add this line to fetch enchant data
    ] = await Promise.all([
      prisma.character.findMany({
        where: {
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
      // Fetch top 2 rings
      prisma.archonGear.findMany({
        where: {
          className: className,
          classSpec: classSpec,
          categoryName: 'Rings', // Ensure this matches your database
        },
        orderBy: {
          popularity: 'desc',
        },
        distinct: ['itemName'], // Ensure distinct items by name
        take: 2,
      }),
      // Fetch top 2 trinkets
      prisma.archonGear.findMany({
        where: {
          className: className,
          classSpec: classSpec,
          categoryName: 'Trinket', // Ensure this matches your database
        },
        orderBy: {
          popularity: 'desc',
        },
        distinct: ['itemName'], // Ensure distinct items by name
        take: 2,
      }),
      // Fetch all items for other categories
      prisma.archonGear.findMany({
        where: {
          className: className,
          classSpec: classSpec,
          categoryName: {
            notIn: ['Rings', 'Trinket'],
          },
        },
        orderBy: {
          popularity: 'desc', // Ensure the most popular item is selected
        },
      }),
      // Fetch enchant data
      prisma.enchantData.findMany({
        where: {
          className: className,
          classSpec: classSpec,
        },
        orderBy: {
          popularity: 'desc',
        },
      }),
    ])

    // Helper function to parse popularity
    const parsePopularity = (popularity: string): number => {
      // Remove the '%' sign and convert to a number
      return parseFloat(popularity.replace('%', ''))
    }

    // Use the interface in your reduce function
    const groupedItems = allItems.reduce<Record<string, Item>>((acc, item) => {
      const itemPopularity = parsePopularity(item.popularity)
      if (!acc[item.categoryName]) {
        acc[item.categoryName] = item
      } else if (
        itemPopularity > parsePopularity(acc[item.categoryName].popularity)
      ) {
        acc[item.categoryName] = item
      }
      return acc
    }, {})

    const highestPopularityItems = [
      ...rings,
      ...trinkets,
      ...Object.values(groupedItems),
    ]

    return NextResponse.json({
      characters,
      archonData,
      whBestGear,
      highestPopularityItems,
      enchantData, // Include enchant data in the response
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
