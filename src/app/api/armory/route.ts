import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

// Utility function to transform class names and specs
const transformToApiFormat = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-')
}

export async function POST(req: Request) {
  const { characterName, realmName, region } = await req.json()

  try {
    const url = `https://worldofwarcraft.blizzard.com/en-us/character/${region}/${realmName}/${characterName}`

    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    // Wait for the content to load
    await page.waitForSelector('.CharacterHeader-detail')

    const content = await page.content()
    const $ = cheerio.load(content)

    // Scrape class and spec
    const classSpecText = $('.CharacterHeader-detail span:last-child').text()
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
        console.log(`Icon style for ${itemSlots[index]}:`, iconStyle)

        let iconUrl = ''
        console.log(`Full style attribute for ${itemSlots[index]}:`, iconStyle)

        // Extract URL using string manipulation
        if (iconStyle.includes('url(')) {
          iconUrl = iconStyle
            .split('url(')[1]
            .split(')')[0]
            .replace(/['"]/g, '')
          console.log(`Extracted URL for ${itemSlots[index]}:`, iconUrl)
        } else {
          console.log(`No URL found for ${itemSlots[index]}`)
        }

        console.log(
          `Final extracted icon URL for ${itemSlots[index]}:`,
          iconUrl,
        )

        const itemName = $itemDetails.find('.CharacterProfile-itemName').text()
        const itemLevel = $itemDetails
          .find('.CharacterProfile-itemLevel')
          .text()

        return {
          slot: itemSlots[index],
          name: itemName,
          level: parseInt(itemLevel) || 0,
          iconUrl: iconUrl,
        }
      })
      .get()

    console.log('Full items array:', JSON.stringify(items, null, 2))

    // Filter out Shirt and Tabard
    const filteredItems = items.filter(
      item => item.slot !== 'Shirt' && item.slot !== 'Tabard',
    )

    await browser.close()
    console.log(filteredItems)
    return NextResponse.json({
      classSpec,
      className,
      charPic,
      items: filteredItems,
    })
  } catch (error) {
    console.error('Error scraping character data:', error)
    return NextResponse.json(
      { error: 'Failed to scrape character data' },
      { status: 500 },
    )
  }
}
