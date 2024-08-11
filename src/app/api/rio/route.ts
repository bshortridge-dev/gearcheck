import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  const { spec, class: characterClass } = await request.json()

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(
    `https://raider.io/mythic-plus-spec-rankings/season-df-4/world/${characterClass}/${spec}`,
  )

  const html = await page.content()

  await browser.close()

  const $ = cheerio.load(html)

  if (characterClass === 'rogue') {
    // Step 1: Get the character names
    const charNames = $('a.class-color--4')
      // Map each element to its text
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3) // Take the       first 10 character names

    // Step 2: Get the parsed character realms
    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        // Get the text of the element and trim whitespace
        const realmText = $(element).text().trim()
        // RegEx to match the realm text and extract locale and realm name
        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          // Extract locale and realm name from the match result
          const [locale, realmName] = matchResult.slice(1, 3)
          // Return an object with locale and realm name
          return { locale, realmName }
        } else {
          // Handle the case where no match was found
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)
      // Filter out null values
      .filter(item => item !== null)

    // Step 3: Create the characters array
    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        // Get the locale and realm name from the character realm
        const { locale, realmName } = charRealm[index]
        // Modify the realm name by converting to lowercase and replacing whitespace with hyphens
        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')
        // Create the character link
        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        // Use Puppeteer to navigate to the URL and extract information
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        // Extract information from the page
        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        // Extract the src link from the <img> tag
        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        // Return the character object with the extracted href data and src links
        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
          // charLinks: hrefData,
          // iconSrc: srcLinks,
        }
      }),
    )

    console.log(characters)

    // Return the characters array as a JSON response
    return NextResponse.json({ characters })
  }

  if (characterClass === 'demon-hunter') {
    const charNames = $('a.class-color--12')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'death-knight') {
    const charNames = $('a.class-color--6')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'druid') {
    const charNames = $('a.class-color--11')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'evoker') {
    const charNames = $('a.class-color--13')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'hunter') {
    const charNames = $('a.class-color--3')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'mage') {
    const charNames = $('a.class-color--8')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'monk') {
    const charNames = $('a.class-color--10')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'paladin') {
    const charNames = $('a.class-color--2')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'priest') {
    const charNames = $('a.class-color--5')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'shaman') {
    const charNames = $('a.class-color--7')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'warlock') {
    const charNames = $('a.class-color--9')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }

  if (characterClass === 'warrior') {
    const charNames = $('a.class-color--1')
      .map((index, element) => $(element).text())
      .get()
      .slice(0, 3)

    const charRealm = $(
      'div.slds-tile__detail.slds-text-body--small a.rio-realm-link',
    )
      .map((index, element) => {
        const realmText = $(element).text().trim()

        const matchResult = realmText.match(/\((.*?)\) (.*)/)
        if (matchResult) {
          const [locale, realmName] = matchResult.slice(1, 3)

          return { locale, realmName }
        } else {
          console.log('No match found')
          return null
        }
      })
      .get()
      .slice(0, 3)

      .filter(item => item !== null)

    const characters = await Promise.all(
      charNames.map(async (name, index) => {
        const { locale, realmName } = charRealm[index]

        const modifiedRealmName = realmName.toLowerCase().replace(/\s/g, '-')

        const link = `https://raider.io/characters/${locale}/${realmName}/${name}`

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.goto(link)

        const hrefData = await page.evaluate(() => {
          const hrefElements = Array.from(
            document.querySelectorAll('a[data-wh-rename-link="false"]'),
          )
          return hrefElements.map(element => element.getAttribute('href'))
        })

        const srcLinks = await page.evaluate(() => {
          const imgElements = Array.from(
            document.querySelectorAll(
              'img.rio-wow-icon.rio-wow-icon--shape-square.rio-wow-icon--medium',
            ),
          )
          return imgElements.map(element => element.getAttribute('src'))
        })

        const combinedData = hrefData.map((href, index) => {
          return {
            href,
            src: srcLinks[index],
          }
        })
        await browser.close()

        return {
          name,
          link,
          charRealm: JSON.stringify({ locale, realmName: modifiedRealmName }),
          combinedData: JSON.stringify(combinedData),
        }
      }),
    )

    console.log(characters)

    return NextResponse.json({ characters })
  }
}
