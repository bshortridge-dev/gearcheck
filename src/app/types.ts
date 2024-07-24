interface Character {
  name: string
  class: string
  spec: string
  ilvl: number
  equipped_items: {
    slot: {
      name: string
    }
    item: {
      id: number
      name: string
    }
  }[]
}
