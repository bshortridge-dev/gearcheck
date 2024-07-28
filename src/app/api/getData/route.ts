import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const className = searchParams.get('class')
  const classSpec = searchParams.get('spec')

  if (!className || !classSpec) {
    return NextResponse.json(
      { error: 'Missing class or spec parameter' },
      { status: 400 },
    )
  }

  try {
    const characters = await prisma.character.findMany({
      where: {
        // @ts-ignore
        className: className,
        classSpec: classSpec,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 3,
    })

    const archonData = await prisma.archonGear.findMany({
      where: {
        // @ts-ignore
        className: className,
        classSpec: classSpec,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json({ characters, archonData })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
