import type { ImgHTMLAttributes } from 'react'
import nuclearWar from '../../assets/icons/nuclear-war.png'
import pandemic from '../../assets/icons/pandemic.png'
import asteroidImpact from '../../assets/icons/asteroid-impact.png'
import climateCollapse from '../../assets/icons/climate-collapse.png'
import zombieApocalypse from '../../assets/icons/zombie-apocalypse.png'
import aiTakeover from '../../assets/icons/ai-takeover.png'
import volcanicWinter from '../../assets/icons/volcanic-winter.png'
import solarFlare from '../../assets/icons/solar-flare.png'

const SCENARIO_ICONS: Record<string, string> = {
  'nuclear-war': nuclearWar,
  'pandemic': pandemic,
  'asteroid-impact': asteroidImpact,
  'climate-collapse': climateCollapse,
  'zombie-apocalypse': zombieApocalypse,
  'ai-takeover': aiTakeover,
  'volcanic-winter': volcanicWinter,
  'solar-flare': solarFlare,
}

export function ScenarioIcon({ id, className, ...props }: { id: string } & ImgHTMLAttributes<HTMLImageElement>) {
  const src = SCENARIO_ICONS[id]
  if (!src) return null
  return <img src={src} alt="" className={`scenario-icon${className ? ` ${className}` : ''}`} {...props} />
}
