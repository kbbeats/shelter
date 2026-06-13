export interface ThemeTokens {
  primaryColor: string
  accentColor: string
  bgColor: string
  surfaceColor: string
  textColor: string
  glowColor: string
  icon: string
}

export const THEME_MAP: Record<string, ThemeTokens> = {
  'nuclear-war': {
    primaryColor: '#FFFF00',
    accentColor: '#FFFF66',
    bgColor: '#0d0000',
    surfaceColor: '#1a0500',
    textColor: '#ffcccc',
    glowColor: 'rgba(255,255,0,0.45)',
    icon: '☢',
  },
  pandemic: {
    primaryColor: '#00E676',
    accentColor: '#69F0AE',
    bgColor: '#071a0e',
    surfaceColor: '#0f2d1a',
    textColor: '#bbf7d0',
    glowColor: 'rgba(0,230,118,0.4)',
    icon: '🦠',
  },
  'asteroid-impact': {
    primaryColor: '#D500F9',
    accentColor: '#EA80FC',
    bgColor: '#020617',
    surfaceColor: '#0f172a',
    textColor: '#c7d2fe',
    glowColor: 'rgba(213,0,249,0.4)',
    icon: '☄️',
  },
  'climate-collapse': {
    primaryColor: '#00E5FF',
    accentColor: '#84FFFF',
    bgColor: '#020c12',
    surfaceColor: '#0c2030',
    textColor: '#bae6fd',
    glowColor: 'rgba(0,229,255,0.4)',
    icon: '🌊',
  },
  'zombie-apocalypse': {
    primaryColor: '#76FF03',
    accentColor: '#B2FF59',
    bgColor: '#0a0d04',
    surfaceColor: '#141a06',
    textColor: '#d9f99d',
    glowColor: 'rgba(118,255,3,0.35)',
    icon: '🧟',
  },
  'ai-takeover': {
    primaryColor: '#2979FF',
    accentColor: '#82B1FF',
    bgColor: '#00040f',
    surfaceColor: '#00091f',
    textColor: '#cffafe',
    glowColor: 'rgba(41,121,255,0.45)',
    icon: '🤖',
  },
  'volcanic-winter': {
    primaryColor: '#FF1744',
    accentColor: '#FF5C77',
    bgColor: '#0a0704',
    surfaceColor: '#1c120a',
    textColor: '#fed7aa',
    glowColor: 'rgba(255,23,68,0.4)',
    icon: '🌋',
  },
  'solar-flare': {
    primaryColor: '#FF6F00',
    accentColor: '#FF9E40',
    bgColor: '#0c0900',
    surfaceColor: '#1c1500',
    textColor: '#fef3c7',
    glowColor: 'rgba(255,111,0,0.5)',
    icon: '☀️',
  },
}
