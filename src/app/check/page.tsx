import Specmenu from '../components/specmenu'
import Image from 'next/image'

export default async function page() {
  return (
    <div className='relative min-h-screen w-full bg-base-100 flex items-center justify-center'>
      {/* Background image */}
      <div
        className='fixed inset-0 bg-cover bg-center opacity-70 scale-x-[-1]'
        style={{
          backgroundImage: "url('/assets/arthas.jpg')",
          top: '0px', // Adjust this value to match your navbar height
        }}
      ></div>

      {/* Content */}
      <div className='relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-3 p-3 w-full lg:w-[80%] min-h-screen'>
        <Specmenu />
        <div className='lg:col-span-3 p-5 mx-4 rounded-box bg-base-200 bg-opacity-80'>
          <div className='max-w-[800px] items-center justify-center lg:ml-28 py-10 ml-4'>
            Welcome to our Best in Slot list for World of Warcraft. Gearcheck
            aims to provide you with up-to-date information on the most popular
            gear choices for each specialization. Our data is gathered daily
            from reputable sources and aggregated here for easy viewing,
            offering a comprehensive snapshot of current gear trends in the WoW
            community.
            <br />
            <br />
            Stay ahead of the curve and make informed gear decisions with
            Gearcheck - your source for competitive gear information.
            <br />
            <br />
            <p className='font-bold text-lg pt-3 text-accent'>Key features: </p>
            <ul className='p-4 ml-6 text-sm bg-base-200 rounded-lg m-3'>
              <li className='list-disc pb-3 text-sm'>
                Daily updates to ensure the most current information{' '}
              </li>
              <li className='list-disc pb-3 text-sm'>
                Detailed breakdown by class and specialization
              </li>
              <li className='list-disc pb-3 text-sm'>
                Easy-to-read format for quick reference
              </li>
            </ul>
            <br />
            <p className='font-bold text-lg pt-3 text-accent'>Please note: </p>
            <ul className='p-4 ml-6 text-sm bg-base-200 rounded-lg m-3'>
              <li className='list-disc pb-3'>
                The gear popularity data displayed here is compiled from
                Warcraft Logs and Raider.io, reflecting current trends among top
                players. While this information can be a valuable starting
                point, we strongly recommend using simulation tools like
                Raidbots.com to optimize your personal gear choices. Every
                character's needs can vary based on their specific stats,
                content focus, and playstyle.
              </li>
              <li className='list-disc pb-3'>
                The top 3 characters listed for each spec are pulled from
                Raider.io rankings. Keep in mind that these players may have
                recently switched specs or participated in PvP activities. As
                such, their current gear may not always represent the optimal
                PvE setup for their listed spec.
              </li>
              <li className='list-disc pb-3'>
                Always approach gear choices critically and consider your own
                gameplay needs and preferences.
              </li>
              <li className='list-disc pb-3 text-error font-semibold italic'>
                <p className='font-bold text-md'>Side note:</p>
                With a new expansion and season coming soon these lists will be
                volatile until a new meta is established and it would be smart
                to refer to the wowhead lists. Wowhead guides are written by
                very knowledgeable players that have tested builds thoroughly.
              </li>
            </ul>
            <div className='flex items-center justify-center'>
              <p className='font-bold text-accent text-xl pt-5'>
                Get started by choosing a your class and spec!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
