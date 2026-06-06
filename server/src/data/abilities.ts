import type { SpecialAbilityCard } from '@shelter/shared'

export const abilityPool: SpecialAbilityCard[] = [
  {
    id: 'reveal_card',
    name: { en: 'Force Reveal', ru: 'Разоблачение' },
    description: {
      en: 'Force another player to publicly reveal one of their hidden cards.',
      ru: 'Заставьте другого игрока раскрыть одну из скрытых карт.',
    },
    effectType: 'reveal_card',
    targetType: 'other',
  },
  {
    id: 'immunity',
    name: { en: 'Immunity', ru: 'Иммунитет' },
    description: {
      en: 'You cannot be exiled this vote. If you get the most votes, the next candidate is exiled instead.',
      ru: 'Вас не могут изгнать. Если за вас проголосуют больше — изгонят следующего.',
    },
    effectType: 'immunity',
    targetType: 'self',
  },
  {
    id: 'inspect',
    name: { en: 'Inspect', ru: 'Инспекция' },
    description: {
      en: 'Secretly view all hidden cards of another player. Only you can see.',
      ru: 'Тайно просмотрите все скрытые карты другого игрока. Только вы увидите.',
    },
    effectType: 'inspect',
    targetType: 'other',
  },
  {
    id: 'silence',
    name: { en: 'Silence', ru: 'Молчание' },
    description: {
      en: 'Target player skips their argument turn next round.',
      ru: 'Цель пропускает ход аргументации в следующем раунде.',
    },
    effectType: 'silence',
    targetType: 'other',
  },
  {
    id: 'double_vote',
    name: { en: 'Double Vote', ru: 'Двойной голос' },
    description: {
      en: 'Your vote counts twice in the next voting round.',
      ru: 'Ваш голос считается дважды в следующем голосовании.',
    },
    effectType: 'double_vote',
    targetType: 'none',
  },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function dealAbilities(playerIds: string[]): Map<string, SpecialAbilityCard[]> {
  const result = new Map<string, SpecialAbilityCard[]>()
  playerIds.forEach(id => {
    const shuffled = shuffle(abilityPool)
    result.set(id, [shuffled[0]])
  })
  return result
}
