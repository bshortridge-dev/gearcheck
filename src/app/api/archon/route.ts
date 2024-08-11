import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  const { spec, class: characterClass } = await request.json()

  const retryCount = 5 // Number of times to retry
  let retry = 0
  let gearCategories: { [key: string]: any } = {}

  while (retry < retryCount) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(
        `https://www.archon.gg/wow/builds/${spec}/${characterClass}/mythic-plus/gear-and-tier-set/10/all-dungeons/this-week#gear-tables`,
      )
      const html = await page.content()
      await browser.close()
      const $ = cheerio.load(html)

      gearCategories = {}

      // Find all tables
      $('table.react-table--v2').each((tableIndex, tableElement) => {
        const tableTitle = $(tableElement)
          .find('thead th:first-child .icon__label--large')
          .text()
          .trim()

        // Only process if tableTitle has a value
        if (tableTitle) {
          const items: any[] = []

          // Process only the first 3 rows of each table
          $(tableElement)
            .find('tbody tr')
            .slice(0, 3)
            .each((rowIndex, rowElement) => {
              // Extract the item name, considering the BiS link
              const itemContainer = $(rowElement).find('td:nth-child(1)')
              let name = itemContainer
                .find('span:not(.tooltip--trigger)') // Exclude the tooltip trigger span
                .first() // Ensure only the first matching element is selected
                .text()
                .trim()

              // Remove "BiS" prefix if it exists anywhere in the name
              name = name.replace(/BiS\s*/g, '').trim()

              const href = itemContainer.find('a').attr('href')
              const maxKey = $(rowElement).find('td:nth-child(2)').text().trim()
              const popularity = $(rowElement)
                .find('td:nth-child(3) span:first-child')
                .text()
                .trim()
              items.push({
                name,
                href,
                maxKey,
                popularity,
                itemIcon: $(rowElement).find('td:nth-child(1) img').attr('src'),
              })
            })

          if (items.length > 0) {
            gearCategories[tableTitle] = {
              items: items,
              categoryName: tableTitle,
            }
          }
        }
      })

      if (Object.keys(gearCategories).length > 0) {
        break // Exit the loop if gearCategories is not empty
      }

      retry++
    } catch (error) {
      console.error('Error:', error)
      retry++
    }
  }

  console.log(JSON.stringify(gearCategories, null, 2))
  return NextResponse.json(gearCategories)
}
