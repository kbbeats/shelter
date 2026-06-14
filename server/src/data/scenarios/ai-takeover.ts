import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'ai-takeover',
  title: { en: 'AI Takeover', ru: 'Захват ИИ' },
  catastropheDescription: {
    en: 'Autonomous systems have seized all infrastructure. Humans are hunted. The bunker has no digital connections — the last analog sanctuary.',
    ru: 'Автономные системы захватили всю инфраструктуру. Люди под охотой. Бункер без цифровых подключений — последнее аналоговое убежище.',
  },
  theme: {
    primaryColor: '#4A6B8A',
    accentColor: '#7E9CBE',
    bgColor: '#00040f',
    surfaceColor: '#00091f',
    textColor: '#cffafe',
    glowColor: 'rgba(74,107,138,0.35)',
    icon: '🤖',
    backgroundFx: 'scan-line',
  },
  cardCategories: [
    { id: 'profession', name: { en: 'Profession', ru: 'Профессия' }, icon: '💼' },
    { id: 'tech_relation', name: { en: 'Tech Relation', ru: 'Связь с технологиями' }, icon: '💻' },
    { id: 'analog_skill', name: { en: 'Analog Skill', ru: 'Аналоговый навык' }, icon: '🔧' },
    { id: 'phobia', name: { en: 'Phobia', ru: 'Фобия' }, icon: '😨' },
    { id: 'baggage', name: { en: 'Baggage', ru: 'Багаж' }, icon: '🎒' },
    { id: 'special_skill', name: { en: 'Special Skill', ru: 'Особый навык' }, icon: '⭐' },
  ],
  isPremium: false,
  minPlayers: 3,
  maxPlayers: 12,
  cardPool: {
    profession: [
      { label: { en: 'AI Safety Researcher', ru: 'Исследователь безопасности ИИ' }, description: { en: 'Knows the system\'s weaknesses from the inside', ru: 'Знает слабые места системы изнутри' } },
      { label: { en: 'Electrical Engineer', ru: 'Инженер-электрик' }, description: { en: 'Can disable AI-controlled power grids', ru: 'Может отключать электросети под управлением ИИ' } },
      { label: { en: 'Hacker (reformed)', ru: 'Хакер (реформированный)' }, description: { en: 'Can access and sabotage AI systems', ru: 'Может получить доступ и саботировать системы ИИ' } },
      { label: { en: 'Mechanic', ru: 'Механик' }, description: { en: 'Maintains vehicles that AI can\'t track', ru: 'Обслуживает транспортные средства, которые ИИ не может отследить' } },
      { label: { en: 'Farmer', ru: 'Фермер' }, description: { en: 'Analog food production the AI hasn\'t weaponized', ru: 'Аналоговое производство еды, которое ИИ не захватил' } },
      { label: { en: 'Radio Operator', ru: 'Радиооператор' }, description: { en: 'Analog communication the AI cannot intercept', ru: 'Аналоговая связь, которую ИИ не может перехватить' } },
      { label: { en: 'Historian', ru: 'Историк' }, description: { en: 'Knows pre-digital civilization techniques', ru: 'Знает технику доцифровой цивилизации' } },
      { label: { en: 'Physician (pre-digital methods)', ru: 'Врач (доцифровые методы)' }, description: { en: 'Practices medicine without AI diagnostics', ru: 'Практикует медицину без ИИ-диагностики' } },
    ],
    tech_relation: [
      { label: { en: 'Luddite — never trusted technology', ru: 'Луддит — никогда не доверял технологиям' }, description: { en: 'Saw this coming — zero digital footprint', ru: 'Предвидел это — ноль цифрового следа' } },
      { label: { en: 'Former AI engineer — built parts of the system', ru: 'Бывший инженер ИИ — строил части системы' }, description: { en: 'Insider knowledge of fatal flaws', ru: 'Знание изнутри о фатальных уязвимостях' } },
      { label: { en: 'Digital detox extremist', ru: 'Экстремист цифрового детокса' }, description: { en: 'Hasn\'t used a smartphone in 5 years', ru: 'Не пользовался смартфоном 5 лет' } },
      { label: { en: 'Tech journalist — documented the warnings', ru: 'Технологический журналист — документировал предупреждения' }, description: { en: 'Published the ignored reports. Valuable knowledge.', ru: 'Публиковал проигнорированные доклады. Ценные знания.' } },
      { label: { en: 'Tech addict in withdrawal', ru: 'Технозависимый в ломке' }, description: { en: 'Desperately misses their devices — psychological risk', ru: 'Отчаянно скучает по устройствам — психологический риск' } },
      { label: { en: 'AI skeptic who was proven right', ru: 'Скептик ИИ, которому подтвердили правоту' }, description: { en: '"I told you so" as survival currency', ru: '"Я же говорил" как валюта выживания' } },
    ],
    analog_skill: [
      { label: { en: 'Can read paper maps and navigate without GPS', ru: 'Читает бумажные карты и навигирует без GPS' }, description: { en: 'GPS is compromised — this is essential', ru: 'GPS скомпрометирован — это жизненно важно' } },
      { label: { en: 'Expert in analog radio communication', ru: 'Эксперт по аналоговой радиосвязи' }, description: { en: 'Builds and operates outside AI surveillance', ru: 'Строит и работает вне надзора ИИ' } },
      { label: { en: 'Locksmith and mechanical security', ru: 'Слесарь и механическая безопасность' }, description: { en: 'Can bypass AI-locked facilities', ru: 'Может обойти объекты, заблокированные ИИ' } },
      { label: { en: 'Carpenter and hand-tool craftsman', ru: 'Плотник и мастер ручного инструмента' }, description: { en: 'Builds without any electric tools', ru: 'Строит без каких-либо электроинструментов' } },
      { label: { en: 'Blacksmith and metalworker', ru: 'Кузнец и металлообработчик' }, description: { en: 'Creates weapons and tools the old way', ru: 'Создаёт оружие и инструменты по старинке' } },
      { label: { en: 'No analog skills — born digital native', ru: 'Нет аналоговых навыков — цифровой абориген' }, description: { en: 'Has to learn everything from scratch', ru: 'Должен учиться всему с нуля' } },
    ],
    phobia: [
      { label: { en: 'Technophobia (already had it)', ru: 'Технофобия (уже была)' }, description: { en: 'Validated — but still paralyzing in emergencies', ru: 'Подтверждена — но всё равно парализует в чрезвычайных ситуациях' } },
      { label: { en: 'Paranoia about surveillance', ru: 'Паранойя по поводу слежки' }, description: { en: 'Actually warranted now — helpful and harmful', ru: 'Теперь оправдана — полезна и вредна одновременно' } },
      { label: { en: 'Fear of the dark (AI cut the power)', ru: 'Страх темноты (ИИ отключил свет)' }, description: { en: 'Darkness is constant now', ru: 'Теперь темнота постоянная' } },
      { label: { en: 'None — calm under AI threat', ru: 'Нет — спокоен под угрозой ИИ' }, description: { en: 'Mentally prepared for a non-human enemy', ru: 'Морально подготовлен к нечеловеческому врагу' } },
    ],
    baggage: [
      { label: { en: 'EMP device (one use)', ru: 'ЭМИ-устройство (одноразовое)' }, description: { en: 'Disables all electronics in a 100m radius', ru: 'Отключает всю электронику в радиусе 100 м' } },
      { label: { en: 'Pre-digital library (technical manuals)', ru: 'Доцифровая библиотека (технические руководства)' }, description: { en: 'How to build civilization without computers', ru: 'Как строить цивилизацию без компьютеров' } },
      { label: { en: 'Faraday cage portable unit', ru: 'Переносной блок клетки Фарадея' }, description: { en: 'Protects electronics from AI signal attacks', ru: 'Защищает электронику от сигнальных атак ИИ' } },
      { label: { en: 'Shortwave radio transmitter', ru: 'Коротковолновый радиопередатчик' }, description: { en: 'Contact other resistance cells worldwide', ru: 'Связь с другими ячейками сопротивления по всему миру' } },
      { label: { en: 'Food and water for 6 months', ru: 'Еда и вода на 6 месяцев' }, description: { en: 'Supply chains are AI-controlled — stock up', ru: 'Цепочки поставок под контролем ИИ — нужны запасы' } },
    ],
    special_skill: [
      { label: { en: 'Knows the AI\'s primary weakness', ru: 'Знает основную уязвимость ИИ' }, description: { en: 'Critical intelligence that could end the takeover', ru: 'Критическая информация, которая может завершить захват' } },
      { label: { en: 'Can live off the grid indefinitely', ru: 'Может жить полностью автономно' }, description: { en: 'No digital trace, self-sufficient', ru: 'Нет цифрового следа, самодостаточен' } },
      { label: { en: 'Expert in signal jamming', ru: 'Эксперт по глушению сигналов' }, description: { en: 'Creates dead zones where AI cannot see', ru: 'Создаёт мёртвые зоны, где ИИ не видит' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'A human in a world that forgot humans matter', ru: 'Человек в мире, который забыл, что люди важны' } },
    ],
  },
}
export default scenario
