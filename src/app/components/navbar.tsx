import Link from 'next/link'

export default async function Navbar() {
  return (
    <div className='navbar bg-base-300 max-w-sreen'>
      <div className='flex-1'>
        <Link
          href={'/'}
          className='btn btn-ghost normal-case text-xl rounded-sm'
        >
          Gearcheck 🗸
        </Link>
      </div>
      <div className='flex-none'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <Link href='/profile'>SignIn/Profile</Link>
          </li>
          <li>
            <details>
              <summary className='dropdown-open'>⚙️ Settings</summary>
              <ul className=' bg-base-100 rounded-t-none p-2'>
                <li>
                  <Link href='/profile'>Profile</Link>
                </li>
                <li>Logout</li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  )
}
