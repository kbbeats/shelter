import type { BunkerConfig, BilingualText } from '@shelter/shared'

const SIZES: BilingualText[] = [
  { en: 'Compact (50 m²)', ru: 'Компактный (50 м²)' },
  { en: 'Medium (200 m²)', ru: 'Средний (200 м²)' },
  { en: 'Spacious (500 m²)', ru: 'Просторный (500 м²)' },
  { en: 'Industrial complex', ru: 'Промышленный комплекс' },
  { en: 'Converted missile silo', ru: 'Переоборудованная ракетная шахта' },
  { en: 'Underground city block', ru: 'Подземный городской квартал' },
]

const FOOD: BilingualText[] = [
  { en: '6 months of rations', ru: 'Паёк на 6 месяцев' },
  { en: '2 years of canned goods', ru: '2 года консервов' },
  { en: '5 years + hydroponics bay', ru: '5 лет + гидропонная ферма' },
  { en: '1 month only — critical', ru: 'Только 1 месяц — критически мало' },
  { en: 'Unlimited — seed vault + lab', ru: 'Неограниченно — семенной банк + лаборатория' },
  { en: 'Unknown — needs assessment', ru: 'Неизвестно — требует оценки' },
]

const WATER: BilingualText[] = [
  { en: 'Filtered river access', ru: 'Доступ к фильтрованной реке' },
  { en: '10-year underground reservoir', ru: 'Подземное водохранилище на 10 лет' },
  { en: 'Rainwater collectors only', ru: 'Только дождевые коллекторы' },
  { en: 'Desalination unit', ru: 'Установка опреснения воды' },
  { en: 'Contaminated — needs engineer', ru: 'Загрязнена — нужен инженер' },
  { en: 'Deep artesian well', ru: 'Глубокая артезианская скважина' },
]

const FEATURES: BilingualText[] = [
  { en: 'Medical bay with surgery suite', ru: 'Медицинский отсек с операционной' },
  { en: 'Armory (locked)', ru: 'Оружейная (заперта)' },
  { en: 'Greenhouse dome', ru: 'Купол теплицы' },
  { en: 'Workshop with full tools', ru: 'Мастерская с полным набором инструментов' },
  { en: 'Radio tower (operational)', ru: 'Радиовышка (рабочая)' },
  { en: 'Library of 10,000 books', ru: 'Библиотека из 10 000 книг' },
  { en: 'Nursery and school room', ru: 'Детская и учебная комната' },
  { en: 'Solar + nuclear power supply', ru: 'Солнечное + ядерное электроснабжение' },
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function generateBunker(playerCount: number): BunkerConfig {
  return {
    capacity: Math.max(2, Math.floor(playerCount / 2)),
    size: pick(SIZES),
    foodSupply: pick(FOOD),
    waterSupply: pick(WATER),
    specialFeature: pick(FEATURES),
  }
}
