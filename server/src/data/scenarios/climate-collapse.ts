import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'climate-collapse',
  title: { en: 'Climate Collapse', ru: 'Климатический коллапс' },
  catastropheDescription: {
    en: 'Mega-floods are rising. 70% of land will be submerged within 18 months. The bunker is on high ground — one of the last dry places.',
    ru: 'Меганаводнения нарастают. 70% суши уйдёт под воду за 18 месяцев. Бункер на возвышенности — одно из последних сухих мест.',
  },
  theme: {
    primaryColor: '#00E5FF',
    accentColor: '#84FFFF',
    bgColor: '#020c12',
    surfaceColor: '#0c2030',
    textColor: '#bae6fd',
    glowColor: 'rgba(0,229,255,0.4)',
    icon: '🌊',
    backgroundFx: 'water-ripple',
  },
  cardCategories: [
    { id: 'profession', name: { en: 'Profession', ru: 'Профессия' }, icon: '💼' },
    { id: 'health', name: { en: 'Health', ru: 'Здоровье' }, icon: '❤️' },
    { id: 'hobby', name: { en: 'Hobby', ru: 'Хобби' }, icon: '🎯' },
    { id: 'phobia', name: { en: 'Phobia', ru: 'Фобия' }, icon: '😨' },
    { id: 'baggage', name: { en: 'Baggage', ru: 'Багаж' }, icon: '🎒' },
    { id: 'special_skill', name: { en: 'Special Skill', ru: 'Особый навык' }, icon: '⭐' },
  ],
  isPremium: false,
  minPlayers: 3,
  maxPlayers: 12,
  cardPool: {
    profession: [
      { label: { en: 'Marine Biologist', ru: 'Морской биолог' }, description: { en: 'When the world becomes ocean, this matters', ru: 'Когда мир станет океаном, это важно' } },
      { label: { en: 'Hydro Engineer', ru: 'Гидроинженер' }, description: { en: 'Manages water systems and flood barriers', ru: 'Управляет водными системами и противопаводковыми барьерами' } },
      { label: { en: 'Climate Scientist', ru: 'Климатолог' }, description: { en: 'Predicts flood timeline and safe window', ru: 'Предсказывает сроки наводнений и безопасное окно' } },
      { label: { en: 'Organic Farmer', ru: 'Фермер-органик' }, description: { en: 'Hydroponics — food without traditional soil', ru: 'Гидропоника — еда без традиционной почвы' } },
      { label: { en: 'Naval Engineer', ru: 'Морской инженер' }, description: { en: 'Can build vessels for post-flood exploration', ru: 'Может строить суда для исследования после потопа' } },
      { label: { en: 'Physician', ru: 'Врач' }, description: { en: 'Waterborne disease is the #1 killer', ru: 'Болезни, передаваемые через воду, — убийца №1' } },
      { label: { en: 'Structural Engineer', ru: 'Конструктор-строитель' }, description: { en: 'Ensures bunker doesn\'t flood from below', ru: 'Гарантирует, что бункер не затопит снизу' } },
      { label: { en: 'Meteorologist', ru: 'Метеоролог' }, description: { en: 'Predicts storm surges for surface ventures', ru: 'Предсказывает штормовые нагоны для вылазок на поверхность' } },
    ],
    health: [
      { label: { en: 'Strong swimmer', ru: 'Отличный пловец' }, description: { en: 'Surface expeditions require swimming ability', ru: 'Вылазки на поверхность требуют умения плавать' } },
      { label: { en: 'Aquaphobia (fear of water)', ru: 'Аквафобия (страх воды)' }, description: { en: 'Worst possible phobia for this scenario', ru: 'Худшая возможная фобия для этого сценария' } },
      { label: { en: 'Perfectly healthy', ru: 'Абсолютно здоров' }, description: { en: 'Ready for anything', ru: 'Готов ко всему' } },
      { label: { en: 'Prone to waterborne illness', ru: 'Склонен к болезням, передаваемым через воду' }, description: { en: 'High risk in a flooded world', ru: 'Высокий риск в затопленном мире' } },
      { label: { en: 'Experienced free diver', ru: 'Опытный фридайвер' }, description: { en: 'Can dive to retrieve supplies', ru: 'Может нырять за запасами' } },
      { label: { en: 'Hypothermia-resistant', ru: 'Устойчив к гипотермии' }, description: { en: 'Flood water is freezing — this is an advantage', ru: 'Вода при наводнении ледяная — это преимущество' } },
    ],
    hobby: [
      { label: { en: 'Sailing and navigation', ru: 'Мореходство и навигация' }, description: { en: 'Builds and operates boats for the new world', ru: 'Строит и управляет лодками для нового мира' } },
      { label: { en: 'Fishing and aquaculture', ru: 'Рыболовство и аквакультура' }, description: { en: 'Infinite food source in a flooded world', ru: 'Бесконечный источник пищи в затопленном мире' } },
      { label: { en: 'Rain collection systems', ru: 'Системы сбора дождевой воды' }, description: { en: 'Clean water from sky — independent of floods', ru: 'Чистая вода с неба — независимо от наводнений' } },
      { label: { en: 'Rock climbing', ru: 'Скалолазание' }, description: { en: 'High ground survival and supply retrieval', ru: 'Выживание на возвышенности и добыча запасов' } },
      { label: { en: 'Carpentry and boat building', ru: 'Плотничество и строительство лодок' }, description: { en: 'Essential for post-flood exploration', ru: 'Необходимо для исследования после потопа' } },
    ],
    phobia: [
      { label: { en: 'Aquaphobia', ru: 'Аквафобия' }, description: { en: 'A crippling fear as the world drowns', ru: 'Парализующий страх, пока мир тонет' } },
      { label: { en: 'Thalassophobia (deep ocean fear)', ru: 'Талассофобия (страх глубокого океана)' }, description: { en: 'The world will become deep ocean', ru: 'Мир станет глубоким океаном' } },
      { label: { en: 'Claustrophobia', ru: 'Клаустрофобия' }, description: { en: 'Bunker life is already a struggle', ru: 'Жизнь в бункере уже сложна' } },
      { label: { en: 'None — loves the rain', ru: 'Нет — любит дождь' }, description: { en: 'This person is weirdly fine with all of this', ru: 'Этот человек странно спокоен со всем этим' } },
    ],
    baggage: [
      { label: { en: 'Inflatable raft + paddle', ru: 'Надувной плот + весло' }, description: { en: 'Surface mobility when water rises', ru: 'Мобильность на поверхности при подъёме воды' } },
      { label: { en: 'Water purification system (industrial)', ru: 'Система очистки воды (промышленная)' }, description: { en: 'Turns floodwater into drinking water', ru: 'Превращает воду наводнения в питьевую' } },
      { label: { en: 'Waterproof seed library', ru: 'Водонепроницаемая библиотека семян' }, description: { en: 'Genetic diversity for a post-flood world', ru: 'Генетическое разнообразие для мира после потопа' } },
      { label: { en: 'Scuba diving equipment', ru: 'Снаряжение для подводного плавания' }, description: { en: 'Access submerged buildings for supplies', ru: 'Доступ к затопленным зданиям для поставок' } },
      { label: { en: 'Weather monitoring station', ru: 'Метеорологическая станция' }, description: { en: 'Predicts storm surges and dry windows', ru: 'Предсказывает штормовые нагоны и сухие периоды' } },
    ],
    special_skill: [
      { label: { en: 'Can build a boat from salvage', ru: 'Может построить лодку из подручных материалов' }, description: { en: 'Mobility is survival in a flooded world', ru: 'Мобильность — это выживание в затопленном мире' } },
      { label: { en: 'Expert in water purification', ru: 'Эксперт по очистке воды' }, description: { en: 'Keeps drinking water safe indefinitely', ru: 'Поддерживает питьевую воду в безопасности бесконечно' } },
      { label: { en: 'Can predict flood surge patterns', ru: 'Может предсказывать паттерны штормовых нагонов' }, description: { en: 'Saves lives by avoiding deadly waves', ru: 'Спасает жизни, избегая смертоносных волн' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Will learn fast or not at all', ru: 'Научится быстро или никогда' } },
    ],
  },
}
export default scenario
