import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium-min'

// Utility function to transform class names and specs
const transformToApiFormat = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(req: Request) {
  const { className, classSpec } = await req.json()

  let browser
  try {
    console.log('Using remote Chromium')
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(
        'https://github.com/bshortridge-dev/gearcheck/raw/main/chromium-v126.0.0-pack.tar',
      ),
      headless: chromium.headless,
    })
    console.log(chromium.executablePath)
    const page = await browser.newPage()

    const url = `https://wowmeta.com/guides/mythic-plus/${transformToApiFormat(
      className,
    )}/${transformToApiFormat(classSpec)}`
    console.log('Scraping URL:', url)

    await page.goto(url)

    const content = await page.content()
    const $ = cheerio.load(content)

    const enchantSlots = [
      'Back',
      'Chest',
      'Wrist',
      'Belt',
      'Feet',
      'Ring',
      'Weapon',
    ]

    const enchants = enchantSlots
      .map(slot => {
        const rows = $(`tr:contains("${slot} Enchant")`)
        let bestEnchant = null
        let highestPopularity = -1

        rows.each((_, element) => {
          const row = $(element)
          const nameElement = row.find('a.wowheadLink')
          const name = nameElement.text().trim()
          const href = nameElement.attr('href')
          const popularityText = row
            .find('td:last-child div:first-child')
            .text()
            .trim()
          const popularity = parseInt(popularityText) || 0

          if (popularity > highestPopularity) {
            const iconElement = row.find('span.iconlarge ins')
            const backgroundImage = iconElement.css('background-image')
            const iconUrl =
              'https://wow.zamimg.com/images/wow/icons/large/inv_misc_enchantedscroll.jpg'

            bestEnchant = {
              slot: `${slot} Enchant`,
              name,
              href,
              popularity: `${popularity}%`,
              iconUrl,
            }
            highestPopularity = popularity
          }
        })

        console.log(`Best enchant for ${slot}:`, bestEnchant)
        return bestEnchant
      })
      .filter(enchant => enchant !== null)

    console.log('Final enchants data:', JSON.stringify(enchants, null, 2))

    return NextResponse.json({ enchants })
  } catch (error) {
    console.error('Error scraping enchant data:', error)
    let errorMessage = 'Failed to scrape enchant data'
    if (error instanceof Error) {
      errorMessage += ': ' + error.message
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  } finally {
    if (browser) {
    }
  }
}
