import { useGameStore } from '../store/gameStore'
import { en } from './en'
import { ru } from './ru'

const translations = { en, ru }

export function useT() {
  const language = useGameStore(s => s.language)
  return (key: string): string => {
    return translations[language][key] ?? translations.en[key] ?? key
  }
}

export function t(key: string, language: 'en' | 'ru'): string {
  return translations[language][key] ?? translations.en[key] ?? key
}
