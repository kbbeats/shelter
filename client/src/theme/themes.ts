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
    primaryColor: '#C9A22A',
    accentColor: '#D9C26A',
    bgColor: '#0d0000',
    surfaceColor: '#1a0500',
    textColor: '#ffcccc',
    glowColor: 'rgba(201,162,42,0.35)',
    icon: '☢',
  },
  pandemic: {
    primaryColor: '#6E8F5C',
    accentColor: '#9BB587',
    bgColor: '#071a0e',
    surfaceColor: '#0f2d1a',
    textColor: '#bbf7d0',
    glowColor: 'rgba(110,143,92,0.3)',
    icon: '🦠',
  },
  'asteroid-impact': {
    primaryColor: '#6B5B95',
    accentColor: '#9685C0',
    bgColor: '#020617',
    surfaceColor: '#0f172a',
    textColor: '#c7d2fe',
    glowColor: 'rgba(107,91,149,0.35)',
    icon: '☄️',
  },
  'climate-collapse': {
    primaryColor: '#4A8B8B',
    accentColor: '#7DB3B0',
    bgColor: '#020c12',
    surfaceColor: '#0c2030',
    textColor: '#bae6fd',
    glowColor: 'rgba(74,139,139,0.35)',
    icon: '🌊',
  },
  'zombie-apocalypse': {
    primaryColor: '#5C7048',
    accentColor: '#8A9C72',
    bgColor: '#0a0d04',
    surfaceColor: '#141a06',
    textColor: '#d9f99d',
    glowColor: 'rgba(92,112,72,0.35)',
    icon: '🧟',
  },
  'ai-takeover': {
    primaryColor: '#4A6B8A',
    accentColor: '#7E9CBE',
    bgColor: '#00040f',
    surfaceColor: '#00091f',
    textColor: '#cffafe',
    glowColor: 'rgba(74,107,138,0.35)',
    icon: '🤖',
  },
  'volcanic-winter': {
    primaryColor: '#A8462E',
    accentColor: '#C97758',
    bgColor: '#0a0704',
    surfaceColor: '#1c120a',
    textColor: '#fed7aa',
    glowColor: 'rgba(168,70,46,0.4)',
    icon: '🌋',
  },
  'solar-flare': {
    primaryColor: '#B5651D',
    accentColor: '#D38A4A',
    bgColor: '#0c0900',
    surfaceColor: '#1c1500',
    textColor: '#fef3c7',
    glowColor: 'rgba(181,101,29,0.5)',
    icon: '☀️',
  },
}
