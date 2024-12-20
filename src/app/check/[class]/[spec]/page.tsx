'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Specmenu from '../../../components/specmenu'
import Script from 'next/script'

interface Character {
  name: string
  className: string
  classSpec: string
  link: string
  charRealm: string
  combinedData: string
}

interface EnchantData {
  slot: string
  name: string
  href: string
  popularity: string
}

interface ArchonItem {
  categoryName: string
  itemName: string
  href: string
  maxKey: string
  popularity: string
  itemIcon: string
  className: string
  classSpec: string
}
interface WhBestGearItem {
  itemSlot: string
  itemName: string
  sourceName: string
  className: string
  classSpec: string
  itemLink: string
  sourceLink?: string // Optional, as it might not always be available
}
declare global {
  interface Window {
    WH?: any
    $WowheadPower?: {
      refreshLinks?: () => void
    }
    whTooltips?: {
      colorLinks: boolean
      iconizeLinks: boolean
      renameLinks: boolean
      iconSize: string
    }
  }
}

const SpecPage = () => {
  const { class: className, spec: classSpec } = useParams<{
    class: string
    spec: string
  }>()
  const [characters, setCharacters] = useState<Character[]>([])
  const [archonData, setArchonData] = useState<ArchonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [whBestGear, setWhBestGear] = useState<WhBestGearItem[]>([])
  const [isWowheadLoaded, setIsWowheadLoaded] = useState(false)
  const wowheadInitialized = React.useRef(false)
  const [enchantData, setEnchantData] = useState<EnchantData[]>([])

  const configureWowhead = () => {
    if (!wowheadInitialized.current) {
      window.whTooltips = {
        colorLinks: false,
        iconizeLinks: true,
        renameLinks: true,
        iconSize: 'medium',
      }
      wowheadInitialized.current = true
    }
  }

  const refreshWowheadLinks = (retries = 5) => {
    if (
      window.WH &&
      window.$WowheadPower &&
      typeof window.$WowheadPower.refreshLinks === 'function'
    ) {
      window.$WowheadPower.refreshLinks()
    } else if (retries > 0) {
      setTimeout(() => refreshWowheadLinks(retries - 1), 1000)
    }
  }

  useEffect(() => {
    if (isWowheadLoaded) {
      configureWowhead()
      refreshWowheadLinks()
    }
  }, [isWowheadLoaded, refreshWowheadLinks])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/getData?class=${className}&spec=${classSpec}`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()

        setCharacters(data.characters)
        setArchonData(data.archonData)
        setWhBestGear(data.whBestGear)
        setEnchantData(data.enchantData) // Add this line

        // Refresh Wowhead links after state update
        setTimeout(() => {
          refreshWowheadLinks()
        }, 100)
      } catch (error) {
        setError('An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [className, classSpec])

  useEffect(() => {
    if (
      isWowheadLoaded &&
      enchantData &&
      whBestGear &&
      archonData &&
      characters &&
      !loading
    ) {
      setTimeout(() => {
        refreshWowheadLinks()
      }, 200)
    }
  }, [
    isWowheadLoaded,
    loading,
    enchantData,
    whBestGear,
    archonData,
    characters,
  ])

  // Group archonData by categoryName
  const groupedArchonData = archonData.reduce((acc, item) => {
    if (!acc[item.categoryName]) {
      acc[item.categoryName] = []
    }
    acc[item.categoryName].push(item)
    return acc
  }, {} as Record<string, ArchonItem[]>)

  const sortByPopularity = (items: ArchonItem[]) => {
    return items.sort((a, b) => {
      const popularityA = parseFloat(a.popularity)
      const popularityB = parseFloat(b.popularity)
      return popularityB - popularityA
    })
  }
  // Sort items in each category by popularity
  Object.keys(groupedArchonData).forEach(key => {
    groupedArchonData[key] = sortByPopularity(groupedArchonData[key])
  })

  const reversedGroupedArchonData = Object.entries(groupedArchonData).reverse()

  return (
    <div className='relative min-h-screen w-full bg-base-100 flex items-center justify-center'>
      <Script
        src='https://wow.zamimg.com/widgets/power.js'
        strategy='afterInteractive'
        onLoad={() => {
          setIsWowheadLoaded(true)
        }}
      />
      {/* Background image */}
      <div
        className='fixed inset-0 bg-cover bg-center opacity-40'
        style={{
          backgroundImage: "url('/assets/jaina.jpg')",
          top: '0px', // Adjust this value to match your navbar height
        }}
      ></div>

      {/* Content */}
      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full min-h-screen'>
        <Specmenu />

        <div className='lg:col-span-3 lg:p-5 lg:mx-4 runded-box bg-base sm:w-full text-sm'>
          <div className='max-w-[800px] items-center justify-center lg:ml-28 py-10 ml-4'>
            <p className='text-error text-lg font-semibold italic'>
              Remember, "Best in Slot" can be situational and may change with
              patches, new content releases, and evolving gameplay strategies.
              Use this guide as a reference, but don't hesitate to experiment
              and find what works best for you!
            </p>
          </div>
          {/* Wowhead data starts here */}

          <div className='collapse collapse-arrow rounded-md bg-base-200 opacity-90 mb-2'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              <h2 className='text-2xl font-bold mb-4'>
                {`${classSpec
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} ${className
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} Wowhead BiS`}
              </h2>
            </div>
            <div className='collapse-content'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  'head',
                  'neck',
                  'shoulders',
                  'cloak',
                  'chest',
                  'wrist',
                  'gloves',
                  'belt',
                  'legs',
                  'feet',
                  'ring',
                  'ring(single target)',
                  'ring(aoe)',
                  'ring 1',
                  'ring 2',
                  'finger 1',
                  'finger 2',
                  'trinket',
                  'trinket 1',
                  'trinket 2',
                  'trinket (general)',
                  'trinket (offensive)',
                  'trinket (defensive)',
                  'trinket 2 (st)',
                  'trinket alt',
                  'trinket (single-target)',
                  'trinket (aoe)',
                  'trinket (4min+ fight)',
                  'active trinket',
                  'passive trinket',
                  'mainhand',
                  'main hand',
                  'staff',
                  'weapon',
                  'weapon (2h)',
                  '2h weapon',
                  '1h weapon',
                  'weapon (1h)',
                  'offhand',
                  'off hand',
                  'alternative',
                ].map(slot => {
                  const items = whBestGear.filter(
                    i => i.itemSlot.toLowerCase() === slot,
                  )
                  const uniqueItems = items.filter(
                    (item, index, self) =>
                      index ===
                      self.findIndex(t => t.itemName === item.itemName),
                  )

                  return uniqueItems.map((item, index) => (
                    <div
                      key={`${slot}-${index}`}
                      className='bg-base-300 p-4 rounded-lg shadow'
                    >
                      <h3 className='text-lg font-semibold mb-2'>
                        {item.itemSlot}
                      </h3>
                      <div className='grid grid-cols-2 gap-2'>
                        <div>
                          <a
                            href={item.itemLink}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:underline hover:font-semibold'
                          >
                            {item.itemName}
                          </a>
                        </div>
                        <div className='text-right pt-2'>
                          <strong>Source:</strong>{' '}
                          {item.sourceLink ? (
                            <a
                              href={item.sourceLink}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='hover:underline hover:font-semibold'
                            >
                              {item.sourceName.replace(
                                /Catalyst(?!:)/,
                                'Catalyst ',
                              )}
                            </a>
                          ) : (
                            item.sourceName.replace(
                              /Catalyst(?!:)/,
                              'Catalyst ',
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                })}
              </div>
            </div>
          </div>

          {/* Archon/Warcraft log data starts here */}

          <div className='collapse collapse-arrow rounded-md bg-base-200 opacity-90 mb-2'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              <h2 className='text-2xl font-bold mb-4'>
                {`${classSpec
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} ${className
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} Warcraft Log Data`}
              </h2>
            </div>
            <div className='collapse-content'>
              {reversedGroupedArchonData.map(([categoryName, items]) => (
                <div key={categoryName} className='mb-8'>
                  <h3 className='text-xl font-semibold mb-4'>{categoryName}</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {items.map((item, index) => {
                      const popularityPercentage = parseFloat(
                        item.popularity.replace('%', ''),
                      )
                      const highestKey = parseInt(item.maxKey.replace('+', ''))

                      const popularityColorClass =
                        popularityPercentage >= 25 && popularityPercentage < 55
                          ? 'text-purple-500 font-semibold'
                          : popularityPercentage >= 55
                          ? 'text-orange-500 font-semibold'
                          : ''

                      const keyColorClass =
                        highestKey >= 10 && highestKey <= 15
                          ? 'text-purple-500 font-semibold'
                          : highestKey >= 16
                          ? 'text-orange-500 font-semibold'
                          : ''

                      return (
                        <div
                          key={index}
                          className='bg-base-300 p-4 rounded-lg shadow'
                        >
                          <div className='flex items-center mb-2'>
                            <a
                              href={item.href}
                              className='hover:underline hover:font-semibold'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {item.itemName}
                            </a>
                          </div>
                          <div>
                            <p>
                              Highest Key Timed:{' '}
                              <span className={keyColorClass}>
                                {item.maxKey}
                              </span>
                            </p>
                            <p>
                              Popularity:{' '}
                              <span className={popularityColorClass}>
                                {item.popularity}
                              </span>
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Enchant data starts here */}
          <div className='collapse collapse-arrow rounded-md bg-base-200 opacity-90 mb-2'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              <h2 className='text-2xl font-bold mb-4'>
                {`${classSpec
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} ${className
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} Recommended Enchants`}
              </h2>
            </div>
            <div className='collapse-content'>
              {loading && (
                <span className='loading loading-dots loading-lg'></span>
              )}
              {!loading && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {enchantData.map((enchant, index) => (
                    <div
                      key={index}
                      className='bg-base-300 p-4 rounded-lg shadow'
                    >
                      <p className='text-lg font-semibold mb-2'>
                        {enchant.slot}
                      </p>
                      <a
                        href={enchant.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-sm hover:underline hover:font-semibold'
                      >
                        {enchant.name}
                      </a>
                      <p className='text-sm mt-2'>
                        Popularity: {enchant.popularity}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Raider.io data starts here */}

          <div className='collapse collapse-arrow rounded-md bg-base-200 opacity-90 mb-2'>
            <input type='checkbox' />
            <div className='collapse-title text-xl font-medium'>
              <h2 className='text-2xl font-bold mb-4'>
                Top 3{' '}
                {`${classSpec
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} ${className
                  .replace(/-/g, ' ')
                  .split(' ')
                  .map((word, index) => {
                    if (index === 0) {
                      return word.charAt(0).toUpperCase() + word.slice(1)
                    } else if (index === 1) {
                      return (
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                      )
                    } else {
                      return word
                    }
                  })
                  .join(' ')} Raider.io Characters`}
              </h2>
            </div>
            <div className='collapse-content'>
              {loading && (
                <span className='loading loading-dots loading-lg'></span>
              )}
              {!loading && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {characters.map(({ name, link, charRealm, combinedData }) => {
                    const parsedCharRealm = JSON.parse(charRealm)
                    const modifiedRealmName = parsedCharRealm.realmName
                      .toLowerCase()
                      .replace(/\s/g, '-')
                    return (
                      <div
                        className='bg-base-300 p-4 rounded-lg shadow'
                        key={name}
                      >
                        <a
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-lg font-semibold hover:underline'
                        >
                          {name} - {parsedCharRealm.locale} -{' '}
                          {modifiedRealmName}
                        </a>
                        <div className='grid grid-cols-2 gap-2 pt-2'>
                          {JSON.parse(combinedData).map(
                            (
                              charData: { href: string; src: string },
                              index: number,
                            ) => (
                              <div className='flex justify-start' key={index}>
                                <a
                                  href={`https:${charData.href}`}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='hover:underline hover:font-semibold'
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecPage
