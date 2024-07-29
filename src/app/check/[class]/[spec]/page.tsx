'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Specmenu from '../../../components/specmenu'

interface Character {
  name: string
  className: string
  classSpec: string
  link: string
  charRealm: string
  combinedData: string
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

const SpecPage = () => {
  const { class: className, spec: classSpec } = useParams<{
    class: string
    spec: string
  }>()
  const [characters, setCharacters] = useState<Character[]>([])
  const [archonData, setArchonData] = useState<ArchonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      } catch (error) {
        setError('An error occurred while fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [className, classSpec])

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
    <div className='relative min-h-screen w-full bg-base-100'>
      {/* Background image */}
      <div
        className='fixed inset-0 bg-cover bg-center opacity-40 mt-16'
        style={{
          backgroundImage: "url('/assets/jaina.jpg')",
        }}
      ></div>

      {/* Content */}
      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full min-h-screen'>
        <Specmenu />

        <div className='lg:col-span-3 lg:p-5 lg:mx-4 runded-box bg-base sm:w-full text-sm'>
          <p className='max-w-[800px] items-center justify-center lg:ml-28 py-10 ml-4'>
            <p className='text-error text-lg font-semibold italic'>
              Remember, "Best in Slot" can be situational and may change with
              patches, new content releases, and evolving gameplay strategies.
              Use this guide as a reference, but don't hesitate to experiment
              and find what works best for you!
            </p>
          </p>
          {/* start collapse cards */}
          <div className='collapse collapse-arrow  rounded-md bg-base-200 opacity-90 mb-2'>
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
                  .join(' ')} Gear Data`}
              </h2>
            </div>
            <div className='collapse-content'>
              {reversedGroupedArchonData.map(([categoryName, items]) => (
                <div key={categoryName} className='mb-8'>
                  <h3 className='text-xl font-semibold mb-4'>{categoryName}</h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className='bg-base-300 p-4 rounded-lg shadow'
                      >
                        <div className='flex items-center mb-2'>
                          <img
                            src={item.itemIcon}
                            alt={item.itemName}
                            className='mr-2 w-[36px] h-[36px] border-2 border-gray-900 rounded-md'
                          />
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
                          <p>Highest Key Timed: {item.maxKey}</p>
                          <p>Popularity: {item.popularity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='collapse collapse-arrow rounded-md opacity-90 bg-base-200'>
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
                <div className='characters-container'>
                  {characters.map(({ name, link, charRealm, combinedData }) => {
                    const parsedCharRealm = JSON.parse(charRealm)
                    const modifiedRealmName = parsedCharRealm.realmName
                      .toLowerCase()
                      .replace(/\s/g, '-')
                    return (
                      <div className='pb-2' key={name}>
                        <a
                          href={link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='hover:font-semibold hover:underline'
                        >
                          {name} - {parsedCharRealm.locale} -{' '}
                          {modifiedRealmName}
                        </a>
                        <div className='flex flex-wrap gap-1 pt-2'>
                          {JSON.parse(combinedData).map(
                            (
                              charData: { href: string; src: string },
                              index: number,
                            ) => (
                              <div className='flex' key={index}>
                                <a href={`https:${charData.href}`}>
                                  <img
                                    src={`https:${charData.src}`}
                                    className='w-[36px] h-[36px] border-2 border-black rounded-md'
                                    alt={name}
                                    width={36}
                                    height={36}
                                  />
                                </a>
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
