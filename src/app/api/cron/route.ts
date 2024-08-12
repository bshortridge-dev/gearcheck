import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import {
  fetchArchonData,
  fetchCharacters,
  fetchEnchantData,
} from '../../lib/dataFetchers'

const prisma = new PrismaClient()
export const dynamic = 'force-dynamic' // Force dynamic (server) route instead of static page

export async function GET() {
  try {
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
    ]

    for (const { class: classParam, spec: specParam } of classSpecs) {
      const archonData = await fetchArchonData(classParam, specParam)
      const characters = await fetchCharacters(classParam, specParam)
      const enchantData = await fetchEnchantData(classParam, specParam)
      const className = classParam
      const classSpec = specParam

      // Update or create Archon data
      for (const category of Object.values(archonData)) {
        for (const item of category.items) {
          await prisma.archonGear.upsert({
            where: {
              className_classSpec_categoryName_itemName: {
                className,
                classSpec,
                categoryName: category.categoryName,
                itemName: item.name,
              },
            },
            update: {
              href: item.href,
              maxKey: item.maxKey,
              popularity: item.popularity,
              itemIcon: item.itemIcon,
            },
            create: {
              className,
              classSpec,
              categoryName: category.categoryName,
              itemName: item.name,
              href: item.href,
              maxKey: item.maxKey,
              popularity: item.popularity,
              itemIcon: item.itemIcon,
            },
          })
        }
      }

      // Delete outdated Archon data
      const validItemNames = Object.values(archonData).flatMap(category =>
        category.items.map((item: { name: any }) => item.name),
      )
      await prisma.archonGear.deleteMany({
        where: {
          className,
          classSpec,
          itemName: { notIn: validItemNames },
        },
      })

      // Update or create character data
      if (characters) {
        for (const character of characters) {
          await prisma.character.upsert({
            where: {
              className_classSpec_name: {
                className,
                classSpec,
                name: character.name,
              },
            },
            update: {
              link: character.link,
              charRealm: character.charRealm,
              combinedData: character.combinedData,
            },
            create: {
              className,
              classSpec,
              name: character.name,
              link: character.link,
              charRealm: character.charRealm,
              combinedData: character.combinedData,
            },
          })
        }
      }

      // Delete outdated character data
      const validCharacterNames = characters
        ? characters.map(char => char.name)
        : []
      await prisma.character.deleteMany({
        where: {
          className,
          classSpec,
          name: { notIn: validCharacterNames },
        },
      })

      // Update or create enchant data
      if (enchantData) {
        for (const enchant of enchantData) {
          await prisma.enchantData.upsert({
            where: {
              className_classSpec_slot_name: {
                className,
                classSpec,
                slot: enchant.slot,
                name: enchant.name,
              },
            },
            update: {
              href: enchant.href,
              popularity: enchant.popularity,
              iconUrl: enchant.iconUrl,
            },
            create: {
              className,
              classSpec,
              slot: enchant.slot,
              name: enchant.name,
              href: enchant.href,
              popularity: enchant.popularity,
              iconUrl: enchant.iconUrl,
            },
          })
        }
      }

      // Delete outdated enchant data
      const validEnchantNames = enchantData
        ? enchantData.map(enchant => enchant.name)
        : []
      await prisma.enchantData.deleteMany({
        where: {
          className,
          classSpec,
          name: { notIn: validEnchantNames },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
