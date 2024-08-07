import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'
import { PrismaClient } from '@prisma/client'

// Create a single PrismaClient instance
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!(global as any).prisma) {
    ;(global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

const classSpecs = [
  { class: 'warrior', spec: 'arms' },
  { class: 'warrior', spec: 'fury' },
  { class: 'warrior', spec: 'protection' },
  { class: 'paladin', spec: 'holy' },
  { class: 'paladin', spec: 'protection' },
  { class: 'paladin', spec: 'retribution' },
  { class: 'hunter', spec: 'beast-mastery' },
  { class: 'hunter', spec: 'marksmanship' },
  { class: 'hunter', spec: 'survival' },
  { class: 'rogue', spec: 'assassination' },
  { class: 'rogue', spec: 'outlaw' },
  { class: 'rogue', spec: 'subtlety' },
  { class: 'priest', spec: 'discipline' },
  { class: 'priest', spec: 'holy' },
  { class: 'priest', spec: 'shadow' },
  { class: 'shaman', spec: 'elemental' },
  { class: 'shaman', spec: 'enhancement' },
  { class: 'shaman', spec: 'restoration' },
  { class: 'druid', spec: 'balance' },
  { class: 'druid', spec: 'feral' },
  { class: 'druid', spec: 'guardian' },
  { class: 'druid', spec: 'restoration' },
  { class: 'monk', spec: 'brewmaster' },
  { class: 'monk', spec: 'mistweaver' },
  { class: 'monk', spec: 'windwalker' },
  { class: 'death-knight', spec: 'blood' },
  { class: 'death-knight', spec: 'unholy' },
  { class: 'death-knight', spec: 'frost' },
  { class: 'warlock', spec: 'affliction' },
  { class: 'warlock', spec: 'demonology' },
  { class: 'warlock', spec: 'destruction' },
  { class: 'evoker', spec: 'augmentation' },
  { class: 'evoker', spec: 'devastation' },
  { class: 'evoker', spec: 'preservation' },
  { class: 'demon-hunter', spec: 'havoc' },
  { class: 'demon-hunter', spec: 'vengeance' },
  { class: 'mage', spec: 'fire' },
  { class: 'mage', spec: 'frost' },
  { class: 'mage', spec: 'arcane' },
]

async function scrapeWowheadData(classParam: string, specParam: string) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-features=site-per-process'],
  })
  const page = await browser.newPage()
  await page.goto(
    `https://www.wowhead.com/guide/classes/${classParam}/${specParam}/bis-gear`,
  )

  // Wait for the specific section heading
  await page.waitForSelector('.wh-center')

  const content = await page.content()
  await browser.close()

  const $ = cheerio.load(content)
  const items: {
    itemSlot: string
    itemName: string
    itemLink: string | null | undefined
    sourceName: string
    sourceLink: string | null | undefined
    className: string
    classSpec: string
  }[] = []

  // Find the first table within the .wh-center div
  const firstTable = $('div.wh-center table.grid').first()

  // If a table is found, process its rows
  if (firstTable.length) {
    firstTable.find('tbody tr').each((_, row) => {
      const $row = $(row)
      const itemSlot = $row.find('td:nth-child(1)').text().trim()
      const itemNameElement = $row.find('td:nth-child(2) a')
      const itemName = itemNameElement.find('.tinyicontxt').text().trim()
      const itemLink = itemNameElement.attr('href')
      const sourceElement = $row.find('td:nth-child(3)')
      const sourceName = sourceElement.text().trim()
      const sourceLink = sourceElement.find('a').attr('href') || ''

      if (itemSlot && itemName) {
        items.push({
          itemSlot,
          itemName,
          itemLink: itemLink || '',
          sourceName,
          sourceLink,
          className: classParam,
          classSpec: specParam,
        })
      }
    })
  }

  console.log(`Found ${items.length} items for ${classParam} - ${specParam}`)
  return items
}

export async function GET() {
  // @ts-ignore
  await prisma.whBestGear.deleteMany()

  try {
    for (const { class: classParam, spec: specParam } of classSpecs) {
      console.log(`Scraping data for ${classParam} - ${specParam}`)
      const items = await scrapeWowheadData(classParam, specParam)
      console.log(
        `Found ${items.length} items for ${classParam} - ${specParam}`,
      )

      for (const item of items) {
        try {
          await prisma.whBestGear.create({
            data: item,
          })
          console.log(`Inserted item: ${item.itemName}`)
        } catch (insertError) {
          console.error(`Error inserting item ${item.itemName}:`, insertError)
        }
      }
    }

    console.log('Data scraping and storage process completed')
    return NextResponse.json({
      message: 'Data scraped and stored successfully',
    })
  } catch (error) {
    console.error('Error in GET function:', error)
    return NextResponse.json(
      {
        error: 'An error occurred while scraping and storing data',
        details: (error as Error).message,
      },
      { status: 500 },
    )
  }
}
