'use client'
import { useState, useEffect } from 'react'
import CenteredImage from '../components/toonImage'
import Script from 'next/script'
import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface Item {
  slot: string
  name: string
  level: number
  iconUrl: string
  enchantment: string | null
  itemId: number
}

interface ArchonItem {
  categoryName: string
  itemName: string
  itemIcon: string
  popularity: string
  href: string
}

interface CharacterData {
  classSpec: string
  className: string
  items: Item[]
  race: string
  level: string
  overallIlvl: number | null
}

interface FormInputs {
  characterName: string
  realmName: string
  region: 'North America' | 'Europe' | 'Taiwan' | 'Korea'
}

interface Toast {
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
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

const mapSlotToArchonGear = (slot: string): string => {
  const slotMapping: { [key: string]: string } = {
    'Main Hand': 'Main-Hand',
    'Off Hand': 'Off-Hand',
    'Trinket 1': 'Trinket',
    'Trinket 2': 'Trinket',
    'Ring 1': 'Rings',
    'Ring 2': 'Rings',
    Head: 'Head',
    Neck: 'Neck',
    Shoulder: 'Shoulders',
    Back: 'Back',
    Chest: 'Chest',
    Wrist: 'Wrist',
    Hands: 'Gloves',
    Waist: 'Belt',
    Legs: 'Legs',
    Feet: 'Feet',
  }
  return slotMapping[slot] || slot
}

export default function Page() {
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [recommendedItems, setRecommendedItems] = useState<ArchonItem[]>([])
  const [isWowheadLoaded, setIsWowheadLoaded] = useState(false)
  const wowheadInitialized = React.useRef(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [enchantData, setEnchantData] = useState<any[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [formInputs, setFormInputs] = useState<FormInputs>({
    characterName: '',
    realmName: '',
    region: 'North America',
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>()

  const addToast = (
    message: string,
    type: 'info' | 'success' | 'warning' | 'error',
  ) => {
    setToasts(prev => [...prev, { message, type }])
    setTimeout(() => {
      setToasts(prev => prev.slice(1))
    }, 8000)
  }

  const configureWowhead = () => {
    if (!wowheadInitialized.current && typeof window !== 'undefined') {
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
      typeof window !== 'undefined' &&
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

  useEffect(() => {
    if (characterData && isWowheadLoaded) {
      setTimeout(() => {
        refreshWowheadLinks()
      }, 500)
    }
  }, [characterData, isWowheadLoaded])

  useEffect(() => {
    if (characterData && isWowheadLoaded) {
      const timer = setTimeout(() => {
        if (window.$WowheadPower && window.$WowheadPower.refreshLinks) {
          window.$WowheadPower.refreshLinks()
        }
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [characterData, isWowheadLoaded])

  const transformToApiFormat = (input: string): string => {
    return input.toLowerCase().replace(/\s+/g, '-')
  }

  const onSubmit: SubmitHandler<FormInputs> = async data => {
    setIsLoading(true)
    setErrorMessage('')
    setFormInputs(data)

    // Clear existing data
    setCharacterData(null)
    setRecommendedItems([])
    setEnchantData([])

    const formattedRealmName = data.realmName.replace(/\s+/g, '-').toLowerCase()

    const regionCode = {
      'North America': 'us',
      Europe: 'eu',
      Taiwan: 'tw',
      Korea: 'kr',
    }[data.region] as 'us' | 'eu' | 'tw' | 'kr'

    try {
      // First, we need to get an access token
      const tokenResponse = await fetch('/api/blizz/') // You'll need to create this endpoint
      const { access_token } = await tokenResponse.json()

      // Now we can make the API calls to Blizzard
      const characterResponse = await fetch(
        `https://${regionCode}.api.blizzard.com/profile/wow/character/${formattedRealmName}/${data.characterName.toLowerCase()}/equipment?namespace=profile-${regionCode}&locale=en_US&access_token=${access_token}`,
      )

      if (!characterResponse.ok) {
        throw new Error('Failed to fetch character data')
      }

      const characterData: any = await characterResponse.json()

      // Process the character data
      const processedCharacterData: CharacterData = {
        classSpec: '', // We need to make another API call to get this
        className: '', // We need to make another API call to get this
        items: characterData.equipped_items
          .filter(
            (item: { slot: { name: string } }) =>
              item.slot.name !== 'Tabard' && item.slot.name !== 'Shirt',
          )
          .map((item: any) => ({
            slot: mapSlotToArchonGear(item.slot.name),
            name: item.name,
            level: item.level.value,
            iconUrl: `https://wow.zamimg.com/images/wow/icons/large/${item.media.key.href
              .split('/')
              .pop()}.jpg`,
            enchantment: item.enchantments
              ? item.enchantments[0].display_string
              : null,
            itemId: item.item.id,
          })),
        race: '', // We need to make another API call to get this
        level: '', // We need to make another API call to get this
        overallIlvl: null, // We need to calculate this
      }

      // Make additional API calls to get class, spec, race, and level
      const characterDetailsResponse = await fetch(
        `https://${regionCode}.api.blizzard.com/profile/wow/character/${formattedRealmName}/${data.characterName.toLowerCase()}?namespace=profile-${regionCode}&locale=en_US&access_token=${access_token}`,
      )
      const characterDetails = await characterDetailsResponse.json()

      processedCharacterData.className = characterDetails.character_class.name
      processedCharacterData.classSpec = characterDetails.active_spec.name
      processedCharacterData.race = characterDetails.race.name
      processedCharacterData.level = characterDetails.level.toString()

      // Calculate overall item level
      processedCharacterData.overallIlvl = Math.round(
        processedCharacterData.items.reduce(
          (sum, item) => sum + item.level,
          0,
        ) / processedCharacterData.items.length,
      )
      // Refresh Wowhead links after state update
      setTimeout(() => {
        refreshWowheadLinks()
      }, 100)
      setCharacterData(processedCharacterData)
      addToast('Character data fetched successfully', 'success')

      // Fetch recommended items and enchant data
      const transformedClassName = transformToApiFormat(
        processedCharacterData.className,
      )
      const transformedClassSpec = transformToApiFormat(
        processedCharacterData.classSpec,
      )

      const recommendedResponse = await fetch(
        `/api/getData?class=${transformedClassName}&spec=${transformedClassSpec}`,
      )

      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json()
        setRecommendedItems(recommendedData.highestPopularityItems)
        setEnchantData(recommendedData.enchantData)
        addToast(
          'Recommended items and enchants fetched successfully',
          'success',
        )
      } else {
        throw new Error('Failed to fetch recommended items and enchants')
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMsg =
        error instanceof Error ? error.message : 'An unknown error occurred'
      setErrorMessage(errorMsg)
      addToast(errorMsg, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const mapSlotToCategory = (slot: string) => {
    return slot // Since we're now using the ArchonGear structure, we can return the slot directly
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Character's Name:</span>
                </div>
                <input
                  type='text'
                  className='grow h-10 rounded-md p-2'
                  {...register('characterName', {
                    required: 'Character name is required',
                    pattern: {
                      value: /^[a-zA-Z]+$/,
                      message: 'Character name must contain only letters',
                    },
                  })}
                />
                {errors.characterName && (
                  <span className='text-red-500'>
                    {errors.characterName.message}
                  </span>
                )}
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Realm Name:</span>
                </div>
                <input
                  type='text'
                  className='grow h-10 rounded-md p-2'
                  {...register('realmName', {
                    required: 'Realm name is required',
                    pattern: {
                      value: /^[a-zA-Z0-9\s]+$/,
                      message:
                        'Realm name must contain only letters, numbers, and spaces',
                    },
                  })}
                />
                {errors.realmName && (
                  <span className='text-red-500'>
                    {errors.realmName.message}
                  </span>
                )}
              </label>

              <label className='form-control w-full max-w-xs'>
                <div className='label'>
                  <span className='label-text'>Region:</span>
                </div>
                <select
                  className='select w-full max-w-xs'
                  {...register('region', { required: 'Region is required' })}
                >
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Taiwan</option>
                  <option>Korea</option>
                </select>
                {errors.region && (
                  <span className='text-red-500'>{errors.region.message}</span>
                )}
              </label>
              <button
                type='submit'
                className='btn btn-sm btn-accent mt-4'
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Compare your gear'}
              </button>
            </form>

            {errorMessage && (
              <div className='text-red-500 mt-4'>{errorMessage}</div>
            )}
            {characterData &&
              characterData.items &&
              characterData.items.length > 0 && (
                <div className='mt-4 p-4 bg-base-200 rounded-box'>
                  <p>
                    <strong>
                      <span className='text-lg font-bold'>
                        {capitalizeFirstLetter(formInputs.characterName)} -{' '}
                        {capitalizeFirstLetter(formInputs.realmName)}{' '}
                      </span>
                      <span className='text-sm'>
                        <br /> Level {characterData.level}{' '}
                        {capitalizeFirstLetter(characterData.race)}{' '}
                        {capitalizeFirstLetter(characterData.classSpec)}{' '}
                        {capitalizeFirstLetter(characterData.className)}{' '}
                      </span>
                      {characterData.overallIlvl !== null && (
                        <span className='text-sm'>
                          <br />
                          {characterData.overallIlvl} iLvl
                        </span>
                      )}
                    </strong>
                  </p>
                </div>
              )}
          </div>
          <div className='lg:col-span-1 flex items-center justify-center'>
            <div className='text-left text-sm bg-base-100 p-2 rounded-md'>
              <p>
                Enter your character's name, realm, and choose your region.
                Gearcheck will load your currently equipped gear and compare it
                to our most popular item data and show you what you are
                currently missing.
                <br />
                <span className='font-semibold text-accent text-md text-left'>
                  Note:
                </span>
                <br />
                Your currently equipped gear is read from the wow armory and
                possibly will not be current. The wow armory should update after
                each log-out so if you are currently logged in to the game
                log-out before using this tool.
              </p>
            </div>
            <div className='toast'>
              {toasts.map((toast, index) => (
                <div key={index} className={`alert alert-${toast.type}`}>
                  <span>{toast.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {characterData &&
          characterData.items &&
          characterData.items.length > 0 && (
            <div className='mt-4 p-4 bg-base-200 rounded-box'>
              <div className='grid grid-cols-2 gap-4 mt-3'>
                {characterData.items
                  .filter(item => item.level !== 0)
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
                      )
                    return (
                      <div key={index} className='bg-base-300 p-2 rounded'>
                        <div className='flex items-center'>
                          <div>
                            <p className='text-sm font-semibold'>{item.slot}</p>
                            <a
                              href={`https://www.wowhead.com/item=${item.itemId}`}
                              data-wowhead={`item=${item.itemId}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-xs hover:font-semibold hover:underline'
                            >
                              {item.name}
                            </a>
                            <p className='text-xs'>Item Level: {item.level}</p>
                            {item.enchantment && (
                              <p className='text-xs text-green-500'>
                                {item.enchantment.split('|')[0]}{' '}
                                {/* This will display only the first part of the enchantment string */}
                              </p>
                            )}
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
              {characterData &&
                characterData.items &&
                characterData.items.length > 0 && (
                  <div className='mt-4 p-4 bg-base-200 rounded-box'>
                    {/* Existing item comparison JSX */}

                    {/* Updated enchant data section */}

                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold mb-2'>
                        Recommended Enchants
                      </h3>

                      <div className='grid grid-cols-2 gap-4'>
                        {enchantData.map((enchant, index) => (
                          <div
                            key={index}
                            className='bg-base-300 p-2 rounded flex items-center'
                          >
                            <div>
                              <p className='text-sm font-semibold'>
                                {enchant.slot}
                              </p>

                              <a
                                href={enchant.href}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-xs hover:font-semibold hover:underline'
                              >
                                {enchant.name}
                              </a>

                              <p className='text-xs'>
                                Popularity: {enchant.popularity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>
    </div>
  )
}
