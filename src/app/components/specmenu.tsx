import Link from 'next/link'

export default function Specmenu() {
  return (
    <ul className='col-span-4 menu bg-base-300 rounded-box lg:col-span-1'>
      <li>
        <details>
          <summary>Choose your Class</summary>
          <ul>
            <details>
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
                Shaman
              </summary>
              <ul>
                <li>
                  <Link href={'/check/shaman/elemental'}>Elemental</Link>
                </li>
                <li>
                  <Link href={'/check/shaman/Enhancement'}>Enhancement</Link>
                </li>
                <li>
                  <Link href={'/check/shaman/restoration'}>Restoration</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
                  <Link href={'/check/druid/restoration'}>Restoration</Link>
                </li>
                <li>
                  <Link href={'/check/druid/Restoration'}>Restoration</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
                Evoker
              </summary>
              <ul>
                <li>
                  <Link href={'/check/evoker/devastation'}>Devastation</Link>
                </li>
                <li>
                  <Link href={'/check/evoker/augmentation'}>Aumentation</Link>
                </li>
                <li>
                  <Link href={'/check/evoker/preservation'}>Preservation</Link>
                </li>
              </ul>
            </details>
            <details>
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
              <summary className='p-1 hover:text-secondary hover:cursor-pointer'>
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
