import type { PlayerCards, Card } from '@shelter/shared'

interface ScenarioFull {
  id: string
  cardCategories: Array<{ id: string; name: { en: string; ru: string }; icon: string }>
  cardPool: Record<string, Array<{ label: { en: string; ru: string }; description: { en: string; ru: string } }>>
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export class CardDealer {
  static deal(scenario: ScenarioFull, playerIds: string[]): Map<string, PlayerCards> {
    const result = new Map<string, PlayerCards>()
    playerIds.forEach(id => result.set(id, {}))

    for (const category of scenario.cardCategories) {
      const pool = shuffle(scenario.cardPool[category.id] || [])
      if (pool.length === 0) continue

      playerIds.forEach((playerId, i) => {
        const template = pool[i % pool.length]
        const card: Card = {
          id: `${category.id}-${playerId}`,
          categoryId: category.id,
          label: template.label,
          description: template.description,
        }
        result.get(playerId)![category.id] = card
      })
    }

    return result
  }
}
