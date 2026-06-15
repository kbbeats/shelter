import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'zombie-apocalypse',
  title: { en: 'Zombie Apocalypse', ru: 'Зомби-апокалипсис' },
  catastropheDescription: {
    en: 'Infection spreads via contact. The undead outnumber the living 100:1. The bunker is sealed. Anyone bitten stays outside.',
    ru: 'Заражение через контакт. Мертвецы превосходят живых 100:1. Бункер запечатан. Укушенные остаются снаружи.',
  },
  story: {
    en: 'It started as reports of a strange illness in a few cities, then spread faster than anyone could track. Within weeks, the infected weren\'t just sick, they stopped responding to anything except movement and sound. Cities fell one by one. The military tried to hold lines and failed. Anyone left now either found somewhere to seal themselves in early, or didn\'t make it.\n\nThis bunker holds 2 people and has supplies for about 6 years. It was built into the side of an old parking structure, and the wall facing the stairwell isn\'t as thick as the rest. Most nights are quiet, but every so often there\'s a faint scraping sound from somewhere above, slow and irregular, gone before anyone can be sure they heard it at all.',
    ru: 'Сначала это были лишь сообщения о странной болезни в нескольких городах, но затем она распространилась быстрее, чем кто-либо успевал отслеживать. Через несколько недель заражённые были уже не просто больны — они перестали реагировать на что-либо, кроме движения и звука. Города падали один за другим. Армия пыталась удерживать рубежи и не смогла. Те, кто остался, либо успели заранее запереться в укрытии, либо не выжили.\n\nЭтот бункер рассчитан на 2 человек и имеет запасы примерно на 6 лет. Он встроен в старую парковочную конструкцию, и стена, обращённая к лестничной клетке, тоньше остальных. Большинство ночей тихие, но временами сверху доносится едва слышный скребущий звук — медленный и неровный, пропадающий прежде, чем кто-либо успеет убедиться, что действительно его слышал.',
  },
  theme: {
    primaryColor: '#5C7048',
    accentColor: '#8A9C72',
    bgColor: '#0a0d04',
    surfaceColor: '#141a06',
    textColor: '#d9f99d',
    glowColor: 'rgba(92,112,72,0.35)',
    icon: '🧟',
    backgroundFx: 'rot-pulse',
  },
  cardCategories: [
    { id: 'profession', name: { en: 'Profession', ru: 'Профессия' }, icon: '💼' },
    { id: 'health', name: { en: 'Health', ru: 'Здоровье' }, icon: '❤️' },
    { id: 'combat_skill', name: { en: 'Combat Skill', ru: 'Боевой навык' }, icon: '⚔️' },
    { id: 'phobia', name: { en: 'Phobia', ru: 'Фобия' }, icon: '😨' },
    { id: 'baggage', name: { en: 'Baggage', ru: 'Багаж' }, icon: '🎒' },
    { id: 'special_skill', name: { en: 'Special Skill', ru: 'Особый навык' }, icon: '⭐' },
  ],
  isPremium: false,
  minPlayers: 3,
  maxPlayers: 12,
  cardPool: {
    profession: [
      { label: { en: 'Military Medic', ru: 'Военный медик' }, description: { en: 'Combat medicine and infection treatment', ru: 'Боевая медицина и лечение инфекций' } },
      { label: { en: 'Weapons Engineer', ru: 'Инженер по вооружению' }, description: { en: 'Can manufacture and repair weapons', ru: 'Может изготавливать и ремонтировать оружие' } },
      { label: { en: 'Virologist', ru: 'Вирусолог' }, description: { en: 'May develop a cure or vaccine', ru: 'Может разработать лечение или вакцину' } },
      { label: { en: 'Former Special Forces', ru: 'Бывший спецназ' }, description: { en: 'Elite combat training, crisis management', ru: 'Элитная боевая подготовка, управление кризисами' } },
      { label: { en: 'Organic Farmer', ru: 'Фермер-органик' }, description: { en: 'Sustainable food without supply chains', ru: 'Устойчивое производство еды без цепочек поставок' } },
      { label: { en: 'Structural Engineer', ru: 'Конструктор-строитель' }, description: { en: 'Reinforces bunker against undead pressure', ru: 'Укрепляет бункер против давления мертвецов' } },
      { label: { en: 'Pharmacist', ru: 'Фармацевт' }, description: { en: 'Manages and synthesizes medical supplies', ru: 'Управляет и синтезирует медикаменты' } },
      { label: { en: 'Electrician', ru: 'Электрик' }, description: { en: 'Maintains electrified perimeter defenses', ru: 'Обслуживает электрифицированный периметр обороны' } },
    ],
    health: [
      { label: { en: 'Naturally resistant to the infection', ru: 'Природная устойчивость к инфекции' }, description: { en: 'Rare immunity — potentially key to a cure', ru: 'Редкий иммунитет — потенциально ключ к лечению' } },
      { label: { en: 'Recently bitten — hiding it', ru: 'Недавно укушен — скрывает это' }, description: { en: '...or are they? The suspense is killing everyone', ru: '...или нет? Напряжение убивает всех' } },
      { label: { en: 'Perfectly healthy (verified)', ru: 'Абсолютно здоров (проверено)' }, description: { en: 'Clean bill of health — not infected', ru: 'Чист — не заражён' } },
      { label: { en: 'Exceptional physical strength', ru: 'Исключительная физическая сила' }, description: { en: 'Holds doors, fights off zombies barehanded', ru: 'Держит двери, отбивается от зомби голыми руками' } },
      { label: { en: 'Chronic illness (not infection-related)', ru: 'Хроническое заболевание (не связанное с инфекцией)' }, description: { en: 'Requires care, but not a threat', ru: 'Требует ухода, но не угроза' } },
    ],
    combat_skill: [
      { label: { en: 'Expert marksman', ru: 'Меткий стрелок' }, description: { en: 'Headshots at 200m — precise and efficient', ru: 'Выстрел в голову с 200 м — точно и эффективно' } },
      { label: { en: 'Melee combat specialist', ru: 'Специалист по ближнему бою' }, description: { en: 'Silent kills — no ammo needed', ru: 'Тихие убийства — не нужны патроны' } },
      { label: { en: 'Tactical driver', ru: 'Тактический водитель' }, description: { en: 'Can navigate through zombie hordes in vehicles', ru: 'Может провести сквозь орды зомби на транспорте' } },
      { label: { en: 'Explosives expert', ru: 'Эксперт по взрывчатке' }, description: { en: 'Crowd control for large zombie groups', ru: 'Контроль толпы для больших групп зомби' } },
      { label: { en: 'No combat training — pacifist', ru: 'Нет боевой подготовки — пацифист' }, description: { en: 'Won\'t fight — must justify with other skills', ru: 'Не будет сражаться — должен оправдать другими навыками' } },
      { label: { en: 'Trained in crowd control techniques', ru: 'Обучен методам контроля толпы' }, description: { en: 'Manages zombie herding and misdirection', ru: 'Управляет зомби-стадами и отвлечением' } },
      { label: { en: 'Self-defense beginner', ru: 'Начинающий в самообороне' }, description: { en: 'Basic skills — better than nothing', ru: 'Базовые навыки — лучше, чем ничего' } },
    ],
    phobia: [
      { label: { en: 'Fear of the undead (logical)', ru: 'Страх нежити (логичный)' }, description: { en: 'Paradoxically, this causes reckless panic', ru: 'Парадоксально, это вызывает безрассудную панику' } },
      { label: { en: 'Fear of blood', ru: 'Гемофобия' }, description: { en: 'Zombie encounters are very, very bloody', ru: 'Встречи с зомби очень, очень кровавые' } },
      { label: { en: 'Germophobia', ru: 'Мизофобия' }, description: { en: 'Appropriate but overwhelming in this environment', ru: 'Уместна, но подавляющая в этой обстановке' } },
      { label: { en: 'None — prepper mindset', ru: 'Нет — ментальность преппера' }, description: { en: 'Was mentally ready for exactly this', ru: 'Был морально готов именно к этому' } },
    ],
    baggage: [
      { label: { en: 'Armory: rifle + 500 rounds + pistol', ru: 'Арсенал: винтовка + 500 патронов + пистолет' }, description: { en: 'Maximum defense capability', ru: 'Максимальные оборонительные возможности' } },
      { label: { en: 'Barbed wire (50m) + alarm system', ru: 'Колючая проволока (50м) + сигнализация' }, description: { en: 'Perimeter defense for the bunker', ru: 'Периметровая защита бункера' } },
      { label: { en: 'Medical trauma kit + blood supply', ru: 'Медицинский набор для травм + запас крови' }, description: { en: 'Bite wound treatment and surgery supplies', ru: 'Лечение ран от укусов и хирургические материалы' } },
      { label: { en: 'Seeds + grow lights', ru: 'Семена + лампы для роста' }, description: { en: 'Long-term food independence', ru: 'Долгосрочная продовольственная независимость' } },
      { label: { en: 'Radio + solar charger', ru: 'Радио + солнечное зарядное устройство' }, description: { en: 'Coordinates with other survivor groups', ru: 'Координирует с другими группами выживших' } },
    ],
    special_skill: [
      { label: { en: 'Knows zombie behavioral patterns', ru: 'Знает паттерны поведения зомби' }, description: { en: 'Predicts horde movements and avoidance routes', ru: 'Предсказывает движения орд и пути обхода' } },
      { label: { en: 'Can move silently', ru: 'Может двигаться бесшумно' }, description: { en: 'Stealth survival in zombie-infested areas', ru: 'Скрытное выживание в заражённых зомби районах' } },
      { label: { en: 'Expert at barricading', ru: 'Эксперт по баррикадированию' }, description: { en: 'Any space becomes a fortress', ru: 'Любое пространство становится крепостью' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Survival instinct only — we\'ll see', ru: 'Только инстинкт выживания — посмотрим' } },
    ],
  },
}
export default scenario
