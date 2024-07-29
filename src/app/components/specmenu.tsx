import Link from 'next/link'

export default function Specmenu() {
  return (
    <ul className='col-span-4 menu rounded-md bg-base-300 lg:col-span-1 lg:max-w-sm lg:h-[120%] opacity-80 lg:-mb-28'>
      <li>
        <details>
          <summary className='font-bold text-accent text-lg'>
            Choose your Class
          </summary>
          <ul>
            <details>
              <summary className='p-1 hover:text-red-500  hover:font-bold hover:cursor-pointer'>
                Death Knight
              </summary>

              <ul>
                <li>
                  <Link href={'/check/death-knight/blood'}>Blood</Link>
                </li>
                <li>
                  <Link href={'/check/death-knight/unholy'}>Unholy</Link>
                </li>
                <li>
                  <Link href={'/check/death-knight/frost'}>Frost</Link>
                </li>
              </ul>
            </details>

            <details>
              <summary className='p-1 hover:text-yellow-300 hover:font-bold hover:cursor-pointer'>
                Rogue
              </summary>
              <ul>
                <li>
                  <Link href={'/check/rogue/assassination'}>Assassination</Link>
                </li>
                <li>
                  <Link href={'/check/rogue/outlaw'}>Outlaw</Link>
                </li>
                <li>
                  <Link href={'/check/rogue/subtlety'}>Subtlety</Link>
                </li>
              </ul>
            </details>

            <details>
              <summary className='p-1 hover:text-teal-300 hover:font-bold hover:cursor-pointer'>
                Mage
              </summary>
              <ul>
                <li>
                  <Link href={'/check/mage/frost'}>Frost</Link>
                </li>
                <li>
                  <Link href={'/check/mage/fire'}>Fire</Link>
                </li>
                <li>
                  <Link href={'/check/mage/arcane'}>Arcane</Link>
                </li>
              </ul>
            </details>

            <details>
              <summary className='p-1 hover:text-purple-600 hover:font-bold hover:cursor-pointer'>
                Demon Hunter
              </summary>
              <ul>
                <li>
                  <Link href={'/check/demon-hunter/havoc'}>Havoc</Link>
                </li>
                <li>
                  <Link href={'/check/demon-hunter/vengeance'}>Vengeance</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-green-300 hover:font-bold hover:cursor-pointer'>
                Monk
              </summary>
              <ul>
                <li>
                  <Link href={'/check/monk/brewmaster'}>Brewmaster</Link>
                </li>
                <li>
                  <Link href={'/check/monk/mistweaver'}>Mistweaver</Link>
                </li>
                <li>
                  <Link href={'/check/monk/windwalker'}>Windwalker</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1  hover:text-blue-500 hover:font-bold hover:cursor-pointer'>
                Shaman
              </summary>
              <ul>
                <li>
                  <Link href={'/check/shaman/elemental'}>Elemental</Link>
                </li>
                <li>
                  <Link href={'/check/shaman/enhancement'}>Enhancement</Link>
                </li>
                <li>
                  <Link href={'/check/shaman/restoration'}>Restoration</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-orange-600 hover:font-bold hover:cursor-pointer'>
                Druid
              </summary>
              <ul>
                <li>
                  <Link href={'/check/druid/balance'}>Balance</Link>
                </li>
                <li>
                  <Link href={'/check/druid/feral'}>Feral</Link>
                </li>
                <li>
                  <Link href={'/check/druid/guardian'}>Guardian</Link>
                </li>
                <li>
                  <Link href={'/check/druid/restoration'}>Restoration</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-pink-300 hover:font-bold hover:cursor-pointer'>
                Paladin
              </summary>
              <ul>
                <li>
                  <Link href={'/check/paladin/holy'}>Holy</Link>
                </li>
                <li>
                  <Link href={'/check/paladin/protection'}>Protection</Link>
                </li>
                <li>
                  <Link href={'/check/paladin/retribution'}>Retribution</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-purple-300 hover:font-bold hover:cursor-pointer'>
                Warlock
              </summary>
              <ul>
                <li>
                  <Link href={'/check/warlock/affliction'}>Affliction</Link>
                </li>
                <li>
                  <Link href={'/check/warlock/demonology'}>Demonology</Link>
                </li>
                <li>
                  <Link href={'/check/warlock/destruction'}>Destruction</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-green-600 hover:font-bold hover:cursor-pointer'>
                Evoker
              </summary>
              <ul>
                <li>
                  <Link href={'/check/evoker/devastation'}>Devastation</Link>
                </li>
                <li>
                  <Link href={'/check/evoker/augmentation'}>Augmentation</Link>
                </li>
                <li>
                  <Link href={'/check/evoker/preservation'}>Preservation</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-white-300 hover:font-bold hover:cursor-pointer'>
                Priest
              </summary>
              <ul>
                <li>
                  <Link href={'/check/priest/discipline'}>Discipline</Link>
                </li>
                <li>
                  <Link href={'/check/priest/holy'}>Holy</Link>
                </li>
                <li>
                  <Link href={'/check/priest/shadow'}>Shadow</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-yellow-900 hover:font-bold hover:cursor-pointer'>
                Warrior
              </summary>
              <ul>
                <li>
                  <Link href={'/check/warrior/arms'}>Arms</Link>
                </li>
                <li>
                  <Link href={'/check/warrior/fury'}>Fury</Link>
                </li>
                <li>
                  <Link href={'/check/warrior/protection'}>Protection</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-lime-500 hover:font-bold hover:cursor-pointer'>
                Hunter
              </summary>
              <ul>
                <li>
                  <Link href={'/check/hunter/beast-mastery'}>
                    Beast Mastery
                  </Link>
                </li>
                <li>
                  <Link href={'/check/hunter/marksmanship'}>Marksmanship</Link>
                </li>
                <li>
                  <Link href={'/check/hunter/survival'}>Survival</Link>
                </li>
              </ul>
            </details>
          </ul>
        </details>
      </li>
    </ul>
  )
  {
    /* End of Class Menu */
  }
}
