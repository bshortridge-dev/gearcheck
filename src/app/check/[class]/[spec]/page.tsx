/* eslint-disable react/no-unescaped-entities*/
'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Specmenu from '../../../components/specmenu'

interface Character {
  name: string
  class: string
  spec: string
  link: string
  realm: string
  charRealm: string
  combinedData: string
  equipped_items: {
    slot: {
      name: string
    }
    item: {
      id: number
      name: string
    }
  }[]
}
interface WowheadItem {
  alt: string
  href: string
}

interface ArchonItem {
  name: string
  href: string
  maxKey: string
  popularity: string
  itemIcon: string
  categoryName: string
  items: []
}

interface ArchonCategory {
  items: ArchonItem[]
  categoryName: string
}

interface ArchonData {
  [key: string]: ArchonCategory
}

const SpecPage = () => {
  const { class: classParam, spec: specParam } = useParams()
  const [characters, setCharacters] = useState<Character[]>([])
  const [archonData, setArchonData] = useState<ArchonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/getData?class=${classParam}&spec=${specParam}`,
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
  }, [classParam, specParam])

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full h-screen justify-center bg-base-100'>
      <Specmenu />
      <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base w-full'>
        <div className='mt-8'>
          <h2 className='text-2xl font-bold mb-4'>
            {specParam} {classParam} Gear Data
          </h2>

          {
            Object.keys(archonData).length > 0
              ? Object.entries(archonData).map(([key, category]) => (
                  <div key={key} className='mb-8'>
                    <h3 className='text-xl font-semibold mb-4'>
                      {category.categoryName}
                    </h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {category.items.map((item: ArchonItem, index: number) => (
                        <div
                          key={index}
                          className='bg-base-200 p-4 rounded-lg shadow'
                        >
                          <div className='flex items-center mb-2'>
                            <img
                              src={item.itemIcon}
                              alt={item.name}
                              className='w-8 h-8 mr-2'
                            />
                            <a
                              href={`${item.href}`}
                              className='text-blue-500 hover:underline'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {item.name}
                            </a>
                          </div>
                          <p>Highest Key Timed: {item.maxKey}</p>
                          <p>Popularity: {item.popularity}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              : ''
            // <div className='text-center'>
            //   <p>No gear data available.</p>
            //   <button
            //     onClick={fetchArchonData}
            //     className='btn btn-primary mt-4'
            //   >
            //     Retry fetching gear.
            //   </button>
            // </div>
          }

          <div>
            <h2 className='text-2xl font-bold mb-4'>
              Top 3 {specParam} {classParam}&apos;s from Raider.io
            </h2>
            {/* {showFetchCharactersButton && !loading && (
              <button
                onClick={fetchCharacters}
                className='btn btn-primary mb-4'
              >
                Get Players
              </button> */}
            {/* )} */}
            {loading && (
              <span className='loading loading-dots loading-lg'></span>
            )}
            {loading ? (
              ''
            ) : (
              <div className='characters-container'>
                {characters.map(({ name, link, charRealm, combinedData }) => {
                  const parsedCharRealm = JSON.parse(charRealm)
                  const modifiedRealmName = parsedCharRealm.realmName
                    .toLowerCase()
                    .replace(/\s/g, '-')
                  return (
                    <div className='character-item' key={name}>
                      <a href={link} target='_blank' rel='noopener noreferrer'>
                        {name} - {parsedCharRealm.locale} - {modifiedRealmName}
                      </a>
                      <div className='flex flex-wrap gap-1'>
                        {JSON.parse(combinedData).map(
                          (
                            charData: { href: string; src: string },
                            index: React.Key | null | undefined,
                          ) => (
                            <div className='flex' key={index}>
                              <a href={`https:${charData.href}`}>
                                <img
                                  src={`https:${charData.src}`}
                                  className='w-[36px] h-[36px] border-2 border-black rounded-md'
                                  alt={name}
                                  width={36}
                                  height={36}
                                ></img>
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

      {/* <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base w-full'>
        <button onClick={fetchWowheadData} disabled={isLoading}>
          {isLoading ? 'Fetching...' : 'Fetch Wowhead Data'}
        </button>
        {error && <p>Error: {error}</p>}
        {wowheadData.length > 0 ? (
          <ul>
            {wowheadData.map((item, index) => (
              <li key={index}>
                <a href={`https://www.wowhead.com${item.href}`}>{item.alt}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No Wowhead data available. Click the button to fetch.</p>
        )}
      </div> */}
    </div>
  )
}

export default SpecPage
