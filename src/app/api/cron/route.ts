import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { fetchArchonData, fetchCharacters } from '../../lib/dataFetchers'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch data for all class/spec combinations
    const classSpecs = [
      { class: 'warrior', spec: 'arms' },
      { class: 'warrior', spec: 'fury' },
      { class: 'warrior', spec: 'protection' },
      { class: 'paladin', spec: 'holy' },
      { class: 'paladin', spec: 'protection' },
      { class: 'paladin', spec: 'retribution' },
      { class: 'hunter', spec: 'beast-mastery' },
      { class: 'hunter', spec: 'marksmanship' },
      { class: 'hunter', spec: 'survival' },
      { class: 'rogue', spec: 'assassination' },
      { class: 'rogue', spec: 'outlaw' },
      { class: 'rogue', spec: 'subtlety' },
      { class: 'priest', spec: 'discipline' },
      { class: 'priest', spec: 'holy' },
      { class: 'priest', spec: 'shadow' },
      { class: 'shaman', spec: 'elemental' },
      { class: 'shaman', spec: 'enhancement' },
      { class: 'shaman', spec: 'restoration' },
      { class: 'druid', spec: 'balance' },
      { class: 'druid', spec: 'feral' },
      { class: 'druid', spec: 'guardian' },
      { class: 'druid', spec: 'restoration' },
      { class: 'monk', spec: 'brewmaster' },
      { class: 'monk', spec: 'mistweaver' },
      { class: 'monk', spec: 'windwalker' },
      { class: 'death-knight', spec: 'blood' },
      { class: 'death-knight', spec: 'unholy' },
      { class: 'death-knight', spec: 'frost' },
      { class: 'warlock', spec: 'affliction' },
      { class: 'warlock', spec: 'demonology' },
      { class: 'warlock', spec: 'destruction' },
      { class: 'evoker', spec: 'augmentation' },
      { class: 'evoker', spec: 'devastation' },
      { class: 'evoker', spec: 'preservation' },
      { class: 'demon-hunter', spec: 'havoc' },
      { class: 'demon-hunter', spec: 'vengeance' },
      { class: 'mage', spec: 'fire' },
      { class: 'mage', spec: 'frost' },
      { class: 'mage', spec: 'arcane' },

      // Add all other class/spec combinations
    ]

    for (const { class: classParam, spec: specParam } of classSpecs) {
      const archonData = await fetchArchonData(classParam, specParam)
      const characters = await fetchCharacters(classParam, specParam)

      // Store Archon data
      for (const category of Object.values(archonData)) {
        for (const item of category.items) {
          await prisma.archonGear.create({
            data: {
              categoryName: category.categoryName,
              itemName: item.name,
              href: item.href,
              maxKey: item.maxKey,
              popularity: item.popularity,
              itemIcon: item.itemIcon,
              classSpec: `${specParam}-${classParam}`,
            },
          })
        }
      }

      // Store character data
      if (characters) {
        for (const character of characters) {
          await prisma.character.create({
            data: {
              name: character.name,
              link: character.link,
              charRealm: character.charRealm,
              combinedData: character.combinedData,
              classSpec: `${specParam}-${classParam}`,
            },
          })
        }
      }
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
