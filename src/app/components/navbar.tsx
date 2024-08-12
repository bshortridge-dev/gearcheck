import Link from 'next/link'

export default async function Navbar() {
  return (
    <div className='navbar z-50 bg-base-300 max-w-screen h-14'>
      <div className='flex-1'>
        <Link href={'/'}>
          <img
            src='./assets/gearcheck.png'
            className='rounded-md transition-transform duration-200 ease-in-out transform active:scale-90'
            alt='Gearcheck'
            height={50}
            width={180}
          />
        </Link>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <Link href='/check'>Current BiS</Link>
          </li>
          <li>
            <Link href='/myToon'>Compare Your Gear</Link>
          </li>
          {/* <li>
            <details>
              <summary className='dropdown-open'>⚙️ Settings</summary>
              <ul className=' bg-base-100 rounded-t-none p-2'>
                <li>
                  <Link href='/profile'>Profile</Link>
                </li>
                <li>Logout</li>
              </ul>
            </details>
          </li> */}
        </ul>
      </div>
    </div>
  )
}
