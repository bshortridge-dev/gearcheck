import { NextResponse } from 'next/server'
import chromium from 'chrome-aws-lambda'
import cheerio from 'cheerio'
import puppeteer from 'puppeteer-core'

// Utility function to transform class names and specs
const transformToApiFormat = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(req: Request) {
  const { className, classSpec } = await req.json()

  try {
    const url = `https://wowmeta.com/guides/mythic-plus/${transformToApiFormat(
      className,
    )}/${transformToApiFormat(classSpec)}`

    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    })

    const page = await browser.newPage()
    await page.goto(url)

    // Wait for the content to load
    await page.waitForSelector('table')

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
            const iconUrl = backgroundImage
              ? backgroundImage.replace(/^url$['"]?/, '').replace(/['"]?$$/, '')
              : 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_enchantedscroll.jpg'

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

        return bestEnchant
      })
      .filter(enchant => enchant !== null)

    await browser.close()

    return NextResponse.json({ enchants })
  } catch (error) {
    console.error('Error scraping enchant data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape enchant data' },
      { status: 500 },
    )
  }
}