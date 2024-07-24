/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
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

const SpecPage = () => {
  const { class: classParam, spec: specParam } = useParams()
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [wowheadData, setWowheadData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // Call the scrape API endpoint with the class and spec parameters
  const fetchCharacters = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/rio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class: classParam, spec: specParam }),
      })
      const data = await response.json()
      setCharacters(data.characters)
    } catch (error) {
      console.error('Error fetching characters:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters()
  }, [classParam, specParam])

  async function fetchWowheadData() {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/wh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ class: classParam, spec: specParam }), // Example values
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setWowheadData(data)
    } catch (error) {
      console.error('Error fetching Wowhead data:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const capSpecParam = (specParam as string)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  const capClassParam = (classParam as string)
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('-', ' ')

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full h-screen justify-center bg-base-100'>
      <Specmenu />
      <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base w-full'>
        <div>
          <h1>
            Top 3 {capSpecParam} {capClassParam}
          </h1>
          {loading ? (
            <span className='loading loading-dots loading-lg'></span>
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
        <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base w-full'>
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
        </div>
      </div>
    </div>
  )
}

export default SpecPage
