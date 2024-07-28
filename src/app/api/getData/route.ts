import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
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
export async function getStaticPaths() {
  // Define the paths that should be generated statically
  const paths = [
    { params: { class: 'warrior', spec: 'protection' } },
    { params: { class: 'warrior', spec: 'fury' } },
    { params: { class: 'warrior', spec: 'arms' } },
    { params: { class: 'paladin', spec: 'holy' } },
    { params: { class: 'paladin', spec: 'protection' } },
    { params: { class: 'paladin', spec: 'retribution' } },
    { params: { class: 'hunter', spec: 'beast-mastery' } },
    { params: { class: 'hunter', spec: 'marksmanship' } },
    { params: { class: 'hunter', spec: 'survival' } },
    { params: { class: 'rogue', spec: 'assassination' } },
    { params: { class: 'rogue', spec: 'outlaw' } },
    { params: { class: 'rogue', spec: 'subtlety' } },
    { params: { class: 'priest', spec: 'discipline' } },
    { params: { class: 'priest', spec: 'holy' } },
    { params: { class: 'priest', spec: 'shadow' } },
    { params: { class: 'shaman', spec: 'elemental' } },
    { params: { class: 'shaman', spec: 'enhancement' } },
    { params: { class: 'shaman', spec: 'restoration' } },
    { params: { class: 'druid', spec: 'balance' } },
    { params: { class: 'druid', spec: 'feral' } },
    { params: { class: 'druid', spec: 'guardian' } },
    { params: { class: 'death-knight', spec: 'blood' } },
    { params: { class: 'death-knight', spec: 'unholy' } },
    { params: { class: 'death-knight', spec: 'frost' } },
    { params: { class: 'warlock', spec: 'affliction' } },
    { params: { class: 'warlock', spec: 'demonology' } },
    { params: { class: 'warlock', spec: 'destruction' } },
    { params: { class: 'evoker', spec: 'augmentation' } },
    { params: { class: 'evoker', spec: 'devastation' } },
    { params: { class: 'evoker', spec: 'preservation' } },
    { params: { class: 'demon-hunter', spec: 'havoc' } },
    { params: { class: 'demon-hunter', spec: 'vengeance' } },
    { params: { class: 'mage', spec: 'fire' } },
    { params: { class: 'mage', spec: 'frost' } },
    { params: { class: 'mage', spec: 'arcane' } },
    // Add more paths as needed
  ]

  return { paths, fallback: true }
}
