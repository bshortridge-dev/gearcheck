import Link from 'next/link'
import Specmenu from '../components/specmenu'

export default async function page() {
  async function checkSlots() {
    const response = await fetch(
      'https://us.api.blizzard.com/profile/wow/character/sargeras/harvesting/equipment?namespace=profile-us&locale=en_US&access_token=US3MOWGxNp1ksGopAWWp1mfd3xfKAFCVox',
    )
    const data = await response.json()
    return data
    console.log(data)
  }
  const equippedItems = await checkSlots()

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full h-screen justify-center bg-base-100'>
      {/* <div className='col-span-4 lg:col-span-4 p-2 rounded-box bg-base-200 max-h-fit'>
        {' '}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod nisi
      </div> */}
      <Specmenu />
      <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base w-full'>
        Retrieved data here
        {/* {equippedItems.equipped_items.map((item: any, index: number) => {
          return (
            <div key={index}>
              {item.slot.name}
              <br />{' '}
              <a href={`https://www.wowhead.com/item=${item.item.id}`}>
                {item.name}
              </a>
            </div>
          )
        })} */}
      </div>
    </div>
  )
}
