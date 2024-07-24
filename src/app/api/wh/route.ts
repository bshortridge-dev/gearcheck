import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

export async function POST(request: Request) {
  const { spec, class: characterClass } = await request.json()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    `https://www.wowhead.com/guide/classes/${characterClass}/${spec}/bis-gear`,
  )

  const html = await page.content()

  await browser.close()

  const $ = cheerio.load(html)

  const whLinks: any[] = []
  $('a[rel="bonus=7981:10358:5871"]').each((index, element) => {
    const href = $(element).attr('href')
    const alt = $(element).find('img').attr('alt')
    whLinks.push({ href, alt })
  })

  // Remove duplicates
  const uniqueLinks = Array.from(
    new Map(whLinks.map(item => [`${item.href}-${item.alt}`, item])).values(),
  )

  console.log(uniqueLinks)
  return NextResponse.json(uniqueLinks)
}
