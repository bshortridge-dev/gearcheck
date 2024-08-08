'use client'
import { useState, FormEvent, ChangeEvent, useEffect } from 'react'
import CenteredImage from '../components/toonImage'
import Script from 'next/script'
import React from 'react'

interface Item {
  slot: string
  name: string
  level: number
  iconUrl: string
}

interface ArchonItem {
  categoryName: string
  itemName: string
  itemIcon: string
  popularity: string
  href: string // Add href to the interface
}

interface CharacterData {
  classSpec: string
  className: string
  charPic: string
  items: Item[]
}

export default function Page() {
  const [characterName, setCharacterName] = useState('')
  const [realmName, setRealmName] = useState('')
  const [region, setRegion] = useState('North America')
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedItems, setRecommendedItems] = useState<ArchonItem[]>([])
  const [isWowheadLoaded, setIsWowheadLoaded] = useState(false)
  const wowheadInitialized = React.useRef(false)
  const [loading, setLoading] = useState(true)

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
  }, [isWowheadLoaded])
  useEffect(() => {
    if (isWowheadLoaded && !loading) {
      setTimeout(() => {
        refreshWowheadLinks()
      }, 100)
    }
  }, [isWowheadLoaded, loading])

  // Utility function to transform class names and specs
  const transformToApiFormat = (input: string): string => {
    return input.toLowerCase().replace(/\s+/g, '-')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formattedRealmName = realmName.replace(/\s+/g, '-').toLowerCase()
    const regionCode = {
      'North America': 'us',
      Europe: 'eu',
      Taiwan: 'tw',
      Korea: 'kr',
    }[region] as 'us' | 'eu' | 'tw' | 'kr'

    try {
      const response = await fetch('/api/armory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterName,
          realmName: formattedRealmName,
          region: regionCode,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch character data')
      }

      const data: CharacterData = await response.json()
      setCharacterData(data)

      // Transform class name and spec for the API call
      const transformedClassName = transformToApiFormat(data.className)
      const transformedClassSpec = transformToApiFormat(data.classSpec)

      // Fetch recommended items
      const recommendedResponse = await fetch(
        `/api/getData?class=${transformedClassName}&spec=${transformedClassSpec}`,
      )
      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json()
        setRecommendedItems(recommendedData.highestPopularityItems)
      }
    } catch (error) {
      console.error('Error fetching character data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  // Helper function to map slot names to category names
  const mapSlotToCategory = (slot: string) => {
    const slotMapping: { [key: string]: string } = {
      Ring: 'Rings',
      Trinket: 'Trinket',
      // Add other mappings if needed
    }
    return slotMapping[slot] || slot
  }

  return (
    <div className='relative min-h-screen w-full bg-base-100 flex justify-center pt-20'>
      <Script
        src='https://wow.zamimg.com/widgets/power.js'
        strategy='afterInteractive'
        onLoad={() => {
          setIsWowheadLoaded(true)
        }}
      />
      <div
        className='fixed inset-0 bg-cover bg-center opacity-40'
        style={{
          backgroundImage: "url('/assets/dwarf.jpeg')",
          top: '0px',
        }}
      ></div>

      <div className='relative z-10 w-full max-w-4xl p-3'>
        <div className='grid lg:grid-cols-3 gap-4 rounded-box bg-base-200 bg-opacity-80 p-5'>
          <div className='lg:col-span-2'>
            <form onSubmit={handleSubmit}>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Character's Name:</span>
                </div>
                <input
                  type='text'
                  className='grow h-10 rounded-md p-2'
                  value={characterName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCharacterName(e.target.value)
                  }
                  required
                />
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Realm Name:</span>
                </div>
                <input
                  type='text'
                  className='grow h-10 rounded-md p-2'
                  value={realmName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setRealmName(e.target.value)
                  }
                  required
                />
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Region:</span>
                </div>
                <select
                  className='select w-full max-w-xs'
                  value={region}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setRegion(e.target.value)
                  }
                >
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Taiwan</option>
                  <option>Korea</option>
                </select>
              </label>
              <button
                type='submit'
                className='btn btn-sm mt-4'
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Compare your gear'}
              </button>
            </form>
          </div>
          <div className='lg:col-span-1 flex items-center justify-center'>
            {characterData && characterData.charPic ? (
              <CenteredImage base64Image={characterData.charPic} />
            ) : (
              <div className='text-center'>
                Character image will appear here
              </div>
            )}
          </div>
        </div>
        {characterData &&
          characterData.items &&
          characterData.items.length > 0 && (
            <div className='mt-4 p-4 bg-base-200 rounded-box'>
              <h2 className='text-xl font-bold mb-2'>Character Data:</h2>
              <p>
                <strong>Class Spec:</strong> {characterData.classSpec}
              </p>
              <p>
                <strong>Class Name:</strong> {characterData.className}
              </p>

              <h3 className='text-lg font-bold mt-4 mb-2'>Items:</h3>
              <div className='grid grid-cols-2 gap-4'>
                {characterData.items
                  .filter(item => item.level !== 0) // Filter out items with level 0
                  .map((item, index) => {
                    const categoryName = mapSlotToCategory(item.slot)
                    const isRingOrTrinket =
                      categoryName === 'Rings' || categoryName === 'Trinket'
                    const recommendedItemsForCategory = recommendedItems
                      .filter(
                        ri =>
                          ri.categoryName === categoryName &&
                          (isRingOrTrinket || ri.itemName !== item.name),
                      )
                      .sort(
                        (a, b) =>
                          parseFloat(b.popularity) - parseFloat(a.popularity),
                      ) // Sort by popularity

                    return (
                      <div key={index} className='bg-base-300 p-2 rounded'>
                        <div className='flex items-center'>
                          <img
                            src={item.iconUrl}
                            alt={item.name}
                            className='w-12 h-12 mr-3 rounded-md border border-stone-700'
                          />
                          <div>
                            <p className='text-sm font-semibold'>{item.slot}</p>
                            <p className='text-xs'>{item.name}</p>
                            <p className='text-xs'>Item Level: {item.level}</p>
                          </div>
                        </div>
                        {recommendedItemsForCategory.length > 0 ? (
                          recommendedItemsForCategory.map(
                            (recommendedItem, idx) => (
                              <div
                                key={idx}
                                className='mt-2 p-2 bg-base-100 rounded'
                              >
                                <p className='text-xs font-semibold'>
                                  Recommended:
                                </p>
                                <div className='flex items-center'>
                                  <img
                                    src={recommendedItem.itemIcon}
                                    alt={recommendedItem.itemName}
                                    className='w-8 h-8 mr-2 rounded-md border border-stone-700'
                                  />
                                  <div>
                                    <a
                                      href={recommendedItem.href}
                                      target='_blank'
                                      rel='noopener noreferrer'
                                      className='text-xs hover:font-semibold hover:underline'
                                    >
                                      {recommendedItem.itemName}
                                    </a>
                                    <p className='text-xs'>
                                      Popularity: {recommendedItem.popularity}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ),
                          )
                        ) : (
                          <div className='mt-2 p-2 bg-base-100 rounded h-[72px]'>
                            <p className='text-xs font-semibold'>
                              No recommendations, already wearing most popular
                              item.
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
