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
    primaryColor: '#ff4444',
    accentColor: '#ff8800',
    bgColor: '#0d0000',
    surfaceColor: '#1a0500',
    textColor: '#ffcccc',
    glowColor: 'rgba(255,68,68,0.5)',
    icon: '☢',
  },
  pandemic: {
    primaryColor: '#22c55e',
    accentColor: '#a3e635',
    bgColor: '#071a0e',
    surfaceColor: '#0f2d1a',
    textColor: '#bbf7d0',
    glowColor: 'rgba(34,197,94,0.4)',
    icon: '🦠',
  },
  'asteroid-impact': {
    primaryColor: '#818cf8',
    accentColor: '#a78bfa',
    bgColor: '#020617',
    surfaceColor: '#0f172a',
    textColor: '#c7d2fe',
    glowColor: 'rgba(129,140,248,0.4)',
    icon: '☄️',
  },
  'climate-collapse': {
    primaryColor: '#06b6d4',
    accentColor: '#0ea5e9',
    bgColor: '#020c12',
    surfaceColor: '#0c2030',
    textColor: '#bae6fd',
    glowColor: 'rgba(6,182,212,0.4)',
    icon: '🌊',
  },
  'zombie-apocalypse': {
    primaryColor: '#84cc16',
    accentColor: '#4d7c0f',
    bgColor: '#0a0d04',
    surfaceColor: '#141a06',
    textColor: '#d9f99d',
    glowColor: 'rgba(132,204,22,0.35)',
    icon: '🧟',
  },
  'ai-takeover': {
    primaryColor: '#22d3ee',
    accentColor: '#67e8f9',
    bgColor: '#00040f',
    surfaceColor: '#00091f',
    textColor: '#cffafe',
    glowColor: 'rgba(34,211,238,0.5)',
    icon: '🤖',
  },
  'volcanic-winter': {
    primaryColor: '#f97316',
    accentColor: '#fb923c',
    bgColor: '#0a0704',
    surfaceColor: '#1c120a',
    textColor: '#fed7aa',
    glowColor: 'rgba(249,115,22,0.4)',
    icon: '🌋',
  },
  'solar-flare': {
    primaryColor: '#fbbf24',
    accentColor: '#fde68a',
    bgColor: '#0c0900',
    surfaceColor: '#1c1500',
    textColor: '#fef3c7',
    glowColor: 'rgba(251,191,36,0.6)',
    icon: '☀️',
  },
  'dinosaur-comet': {
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    bgColor: '#100800',
    surfaceColor: '#1c1000',
    textColor: '#fde68a',
    glowColor: 'rgba(217,119,6,0.5)',
    icon: '🦕',
  },
}
