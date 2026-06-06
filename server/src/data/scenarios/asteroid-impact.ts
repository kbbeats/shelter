import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'asteroid-impact',
  title: { en: 'Asteroid Impact', ru: 'Удар астероида' },
  catastropheDescription: {
    en: 'A 6km asteroid has struck. Impact winter begins — no sunlight for 5 years. The bunker is your only chance of survival.',
    ru: 'Астероид диаметром 6 км упал на Землю. Начинается ударная зима — солнца не будет 5 лет. Бункер — единственный шанс выжить.',
  },
  theme: {
    primaryColor: '#818cf8',
    accentColor: '#a78bfa',
    bgColor: '#020617',
    surfaceColor: '#0f172a',
    textColor: '#c7d2fe',
    glowColor: 'rgba(129,140,248,0.4)',
    icon: '☄️',
    backgroundFx: 'star-debris',
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
      { label: { en: 'Astrophysicist', ru: 'Астрофизик' }, description: { en: 'Can predict when the winter ends', ru: 'Может предсказать, когда закончится зима' } },
      { label: { en: 'Geologist', ru: 'Геолог' }, description: { en: 'Expert in underground mineral resources', ru: 'Эксперт по подземным минеральным ресурсам' } },
      { label: { en: 'Agricultural Scientist', ru: 'Агроном-учёный' }, description: { en: 'Can grow food without sunlight', ru: 'Может выращивать еду без солнечного света' } },
      { label: { en: 'Structural Engineer', ru: 'Конструктор-строитель' }, description: { en: 'Assesses bunker integrity after seismic events', ru: 'Оценивает целостность бункера после сейсмических событий' } },
      { label: { en: 'Nuclear Physicist', ru: 'Ядерный физик' }, description: { en: 'Can optimize power generation underground', ru: 'Может оптимизировать выработку энергии под землёй' } },
      { label: { en: 'Organic Farmer', ru: 'Фермер-органик' }, description: { en: 'Hydroponic expertise for zero-light growing', ru: 'Гидропонные знания для выращивания без света' } },
      { label: { en: 'Mycologist', ru: 'Миколог' }, description: { en: 'Fungi grow without sunlight — essential food source', ru: 'Грибы растут без солнца — важнейший источник питания' } },
      { label: { en: 'Psychologist', ru: 'Психолог' }, description: { en: 'Sunless winters cause depression — critical role', ru: 'Безсолнечные зимы вызывают депрессию — критическая роль' } },
      { label: { en: 'Military Strategist', ru: 'Военный стратег' }, description: { en: 'Plans defense against desperate surface survivors', ru: 'Планирует защиту от отчаявшихся выживших с поверхности' } },
      { label: { en: 'Chef', ru: 'Шеф-повар' }, description: { en: 'Makes limited rations psychologically sustainable', ru: 'Делает ограниченный паёк психологически переносимым' } },
    ],
    health: [
      { label: { en: 'Vitamin D deficiency-resistant', ru: 'Устойчив к дефициту витамина D' }, description: { en: 'No sunlight is less harmful for them', ru: 'Отсутствие солнца менее вредно для них' } },
      { label: { en: 'Seasonal affective disorder', ru: 'Сезонное аффективное расстройство' }, description: { en: '5-year darkness will be devastating mentally', ru: '5 лет темноты будет психически разрушительно' } },
      { label: { en: 'Photosensitive (allergic to light)', ru: 'Светочувствительность (аллергия на свет)' }, description: { en: 'Actually thrives without sunlight — ironic advantage', ru: 'На самом деле процветает без солнечного света — ироничное преимущество' } },
      { label: { en: 'Night vision naturally', ru: 'Природное ночное зрение' }, description: { en: 'Functions well in low-light underground', ru: 'Хорошо функционирует в условиях слабого освещения' } },
      { label: { en: 'Perfectly healthy', ru: 'Абсолютно здоров' }, description: { en: 'No special considerations', ru: 'Никаких особых условий' } },
      { label: { en: 'Asthmatic', ru: 'Астматик' }, description: { en: 'Poor air circulation underground is dangerous', ru: 'Плохая вентиляция под землёй опасна' } },
      { label: { en: 'Exceptionally strong constitution', ru: 'Исключительно крепкое здоровье' }, description: { en: 'Resists the cold and malnutrition well', ru: 'Хорошо переносит холод и недоедание' } },
      { label: { en: 'Chronic joint pain', ru: 'Хроническая боль в суставах' }, description: { en: 'Underground cold worsens the condition significantly', ru: 'Подземный холод значительно усиливает состояние' } },
    ],
    hobby: [
      { label: { en: 'Amateur astronomy (ironic now)', ru: 'Любительская астрономия (теперь ироничное)' }, description: { en: 'Planned for exactly the opposite scenario', ru: 'Готовился к прямо противоположному сценарию' } },
      { label: { en: 'Mushroom cultivation', ru: 'Выращивание грибов' }, description: { en: 'Can feed the group without light', ru: 'Может кормить группу без света' } },
      { label: { en: 'Ham radio', ru: 'Радиолюбитель' }, description: { en: 'Contacts survivors across the frozen world', ru: 'Связывается с выжившими по всему замёрзшему миру' } },
      { label: { en: 'Cave exploration (spelunking)', ru: 'Спелеология' }, description: { en: 'Expert in underground navigation and safety', ru: 'Эксперт по подземной навигации и безопасности' } },
      { label: { en: 'Yoga and mindfulness', ru: 'Йога и осознанность' }, description: { en: 'Essential for mental health in darkness', ru: 'Необходима для психического здоровья в темноте' } },
      { label: { en: 'Fermentation and brewing', ru: 'Ферментация и варка' }, description: { en: 'Preserves food and maintains group morale', ru: 'Сохраняет еду и поддерживает моральный дух группы' } },
      { label: { en: 'Mechanical repair', ru: 'Механический ремонт' }, description: { en: 'Fixes life-support systems when they fail', ru: 'Чинит системы жизнеобеспечения при поломке' } },
    ],
    phobia: [
      { label: { en: 'Fear of the dark', ru: 'Страх темноты' }, description: { en: '5 years of darkness is a living nightmare', ru: '5 лет темноты — живой кошмар' } },
      { label: { en: 'Claustrophobia', ru: 'Клаустрофобия' }, description: { en: 'Confined bunker with no exit option', ru: 'Замкнутый бункер без возможности выхода' } },
      { label: { en: 'Fear of earthquakes', ru: 'Страх землетрясений' }, description: { en: 'Impact aftershocks are constant', ru: 'Ударные толчки постоянны' } },
      { label: { en: 'Nyctophobia extreme', ru: 'Крайняя никтофобия' }, description: { en: 'Total darkness causes complete breakdown', ru: 'Полная темнота вызывает полный срыв' } },
      { label: { en: 'None — excellent stability', ru: 'Нет — отличная стабильность' }, description: { en: 'Handles extreme conditions without fear', ru: 'Справляется с экстремальными условиями без страха' } },
      { label: { en: 'Catastrophophobia (fear of disasters)', ru: 'Катастрофофобия' }, description: { en: 'The very scenario they feared has happened', ru: 'Именно тот сценарий, которого они боялись, произошёл' } },
    ],
    baggage: [
      { label: { en: 'Full-spectrum grow lights + solar battery', ru: 'Полноспектральные лампы + солнечная батарея' }, description: { en: 'Enables plant growing underground', ru: 'Позволяет выращивать растения под землёй' } },
      { label: { en: 'Astronomical telescope + data', ru: 'Астрономический телескоп + данные' }, description: { en: 'Tracks when sky clears from underground vents', ru: 'Отслеживает очищение неба через подземные вентиляционные отверстия' } },
      { label: { en: 'Mushroom spore collection (50 varieties)', ru: 'Коллекция грибных спор (50 видов)' }, description: { en: 'Year-round food source without sunlight', ru: 'Круглогодичный источник питания без солнечного света' } },
      { label: { en: 'Emergency heating unit', ru: 'Аварийное отопительное устройство' }, description: { en: 'Impact winter means brutal cold', ru: 'Ударная зима означает жестокий холод' } },
      { label: { en: 'Vitamin and mineral supplement stockpile', ru: 'Запас витаминов и минеральных добавок' }, description: { en: 'Prevents deficiency disease in sunless years', ru: 'Предотвращает болезни от дефицита в годы без солнца' } },
      { label: { en: 'Seismograph', ru: 'Сейсмограф' }, description: { en: 'Early warning for aftershocks and cave collapse', ru: 'Раннее предупреждение о толчках и обвале пещеры' } },
      { label: { en: 'Nothing — brought only knowledge', ru: 'Ничего — принёс только знания' }, description: { en: 'No physical supplies, but expertise is everything', ru: 'Нет физических запасов, но экспертиза — это всё' } },
    ],
    special_skill: [
      { label: { en: 'Can calculate exact impact winter duration', ru: 'Может рассчитать точную продолжительность ударной зимы' }, description: { en: 'Gives the group a target date to survive toward', ru: 'Даёт группе целевую дату для выживания' } },
      { label: { en: 'Grows food in complete darkness', ru: 'Выращивает еду в полной темноте' }, description: { en: 'Mastered no-light aquaponics', ru: 'Освоил аквапонику без света' } },
      { label: { en: 'Resists extreme cold naturally', ru: 'Естественно устойчив к экстремальному холоду' }, description: { en: 'Efficient metabolism in freezing temperatures', ru: 'Эффективный метаболизм при морозных температурах' } },
      { label: { en: 'Expert in bunker structural safety', ru: 'Эксперт по конструктивной безопасности бункера' }, description: { en: 'Prevents collapse from impact aftershocks', ru: 'Предотвращает обвал от ударных толчков' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Will have to earn their place through character', ru: 'Придётся заслужить место своим характером' } },
    ],
  },
}
export default scenario
