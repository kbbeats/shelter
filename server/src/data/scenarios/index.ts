import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
export interface ScenarioFull extends ScenarioPublic {
  cardPool: Record<string, CardTemplate[]>
}

import nuclearWar from './nuclear-war'
import pandemic from './pandemic'
import asteroidImpact from './asteroid-impact'
import climateCollapse from './climate-collapse'
import zombieApocalypse from './zombie-apocalypse'
import aiTakeover from './ai-takeover'
import volcanicWinter from './volcanic-winter'
import solarFlare from './solar-flare'
import dinosaurComet from './dinosaur-comet'

const allScenarios: ScenarioFull[] = [
  nuclearWar,
  pandemic,
  asteroidImpact,
  climateCollapse,
  zombieApocalypse,
  aiTakeover,
  volcanicWinter,
  solarFlare,
  dinosaurComet,
]

export const scenarioMap = new Map<string, ScenarioFull>(
  allScenarios.map(s => [s.id, s])
)

export function getScenarioPublicList(): ScenarioPublic[] {
  return allScenarios.map(({ cardPool: _cp, ...pub }) => {
    void _cp
    return pub
  })
}
