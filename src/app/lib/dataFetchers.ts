import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

export async function fetchArchonData(classParam: string, specParam: string) {
  const retryCount = 5 // Number of times to retry
  let retry = 0
  let gearCategories: { [key: string]: any } = {}

  while (retry < retryCount) {
    try {
      const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-features=site-per-process'],
      })
      const page = await browser.newPage()
      await page.goto(
        `https://www.archon.gg/wow/builds/${specParam}/${classParam}/mythic-plus/gear-and-tier-set/10/all-dungeons/this-week#gear-tables`,
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
                .find('span:not(.tooltip--trigger)')
                .first()
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

  return gearCategories
}
export async function fetchCharacters(classParam: string, specParam: string) {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
      `https://raider.io/mythic-plus-spec-rankings/season-df-4/world/${classParam}/${specParam}`,
    )

    const html = await page.content()
    await browser.close()

    const $ = cheerio.load(html)

    if (classParam === 'demon-hunter') {
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

      return characters
    }

    if (classParam === 'death-knight') {
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

      return characters
    }

    if (classParam === 'druid') {
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

      return characters
    }

    if (classParam === 'evoker') {
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

      return characters
    }

    if (classParam === 'hunter') {
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

      return characters
    }

    if (classParam === 'mage') {
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

      return characters
    }

    if (classParam === 'monk') {
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

      return characters
    }

    if (classParam === 'paladin') {
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

      return characters
    }

    if (classParam === 'priest') {
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

      return characters
    }

    if (classParam === 'shaman') {
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

      return characters
    }

    if (classParam === 'warlock') {
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

      return characters
    }

    if (classParam === 'warrior') {
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

      return characters
    }
  } catch (error) {
    console.error('Error fetching characters:', error)
  }
}
