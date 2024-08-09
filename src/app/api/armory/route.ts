import { NextResponse } from 'next/server'
import cheerio from 'cheerio'
import puppeteer from 'puppeteer'

// Utility function to transform class names and specs
const transformToApiFormat = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(req: Request) {
  const { characterName, realmName, region } = await req.json()

  try {
    const url = `https://worldofwarcraft.blizzard.com/en-us/character/${region}/${realmName}/${characterName}`

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    })

    const page = await browser.newPage()
    await page.goto(url)

    // Wait for the content to load
    await page.waitForSelector('.CharacterHeader-detail')

    const content = await page.content()
    const $ = cheerio.load(content)

    // Scrape class, spec, and race
    const headerDetails = $('.CharacterHeader-detail span')
      .map((_, el) => $(el).text())
      .get()

    // Assuming the format is always [level, race, class spec]
    const [level, race, classSpecText] = headerDetails
    const classSpecParts = classSpecText.split(' ')

    let rawClassSpec, rawClassName

    // Check if the spec is "Beast Mastery"
    if (classSpecParts[0] === 'Beast' && classSpecParts[1] === 'Mastery') {
      rawClassSpec = 'Beast Mastery'
      rawClassName = classSpecParts.slice(2).join(' ')
    } else {
      rawClassSpec = classSpecParts[0]
      rawClassName = classSpecParts.slice(1).join(' ')
    }

    // Transform class name and spec
    const classSpec = transformToApiFormat(rawClassSpec)
    const className = transformToApiFormat(rawClassName)

    // Scrape character image
    const charPic = $('img[src^="data:image/png;base64"]').attr('src')

    // Scrape overall item level
    const ilvlElement = $('.CharacterHeader-media')
      .filter(function () {
        return $(this).find('.Icon--swords').length > 0
      })
      .find('.Media-text')
    const ilvlText = ilvlElement.text().trim()
    const ilvlMatch = ilvlText.match(/(\d+)\s*ilvl/)
    const overallIlvl = ilvlMatch ? parseInt(ilvlMatch[1], 10) : null

    // Scrape item details
    const itemSlots = [
      'Head',
      'Neck',
      'Shoulders',
      'Back',
      'Chest',
      'Shirt',
      'Tabard',
      'Wrist',
      'Gloves',
      'Belt',
      'Legs',
      'Feet',
      'Ring',
      'Ring',
      'Trinket',
      'Trinket',
      'Main-Hand',
      'Off-Hand',
    ]

    const items = $('.CharacterProfile-itemSlot')
      .map((index, element) => {
        const $item = $(element)
        const $itemDetails = $item.next('.CharacterProfile-itemDetails')

        const iconElement = $item.find('.GameIcon-icon')
        const iconStyle = iconElement.attr('style') || ''

        let iconUrl = ''
        if (iconStyle.includes('url(')) {
          iconUrl = iconStyle
            .split('url(')[1]
            .split(')')[0]
            .replace(/['"]/g, '')
        }

        const itemName = $itemDetails.find('.CharacterProfile-itemName').text()
        const itemLevel = $itemDetails
          .find('.CharacterProfile-itemLevel')
          .text()

        const enchantment = $itemDetails
          .find('.CharacterProfile-itemEnchantment')
          .text()
          .trim()

        return {
          slot: itemSlots[index],
          name: itemName,
          level: parseInt(itemLevel) || 0,
          iconUrl: iconUrl,
          enchantment: enchantment || null,
        }
      })
      .get()

    // Filter out Shirt and Tabard
    const filteredItems = items.filter(
      item => item.slot !== 'Shirt' && item.slot !== 'Tabard',
    )

    await browser.close()

    return NextResponse.json({
      classSpec,
      className,
      charPic,
      items: filteredItems,
      race,
      level,
      overallIlvl,
    })
  } catch (error) {
    console.error('Error scraping character data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape character data' },
      { status: 500 },
    )
  }
}
