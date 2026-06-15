import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic {
  cardPool: Record<string, CardTemplate[]>
}

const scenario: ScenarioFull = {
  id: 'pandemic',
  title: { en: 'Global Pandemic', ru: 'Глобальная пандемия' },
  catastropheDescription: {
    en: 'A novel pathogen with 94% mortality has spread worldwide. The bunker is the last clean zone. Strict quarantine is permanent.',
    ru: 'Новый патоген с 94% смертностью распространился по всему миру. Бункер — последняя чистая зона. Строгий карантин навсегда.',
  },
  story: {
    en: 'A new virus appeared eighteen months ago. It spread fast, before anyone understood how dangerous it was, and by the time anyone reacted, most cities had already shut down. Hospitals overflowed, then emptied out completely. With so few people left moving around, rats and insects took over the abandoned buildings and tunnels, multiplying without anything to stop them.\n\nThis bunker holds 2 people and has supplies for about 3 years. The problem is its ventilation shaft connects to an old sewer line, and it\'s become a highway for rats and cockroaches. They get into the food stores, chew through wiring, and show up in the bunk at night. Pest control has become a daily chore down here, one nobody can really afford to ignore.',
    ru: 'Новый вирус появился восемнадцать месяцев назад. Он распространялся быстро, ещё до того, как кто-либо понял, насколько он опасен, и к моменту, когда начали действовать, большинство городов уже были закрыты. Больницы переполнились, а затем опустели полностью. Из-за того, что вокруг почти не осталось людей, крысы и насекомые заполонили опустевшие здания и тоннели, размножаясь без всяких преград.\n\nЭтот бункер рассчитан на 2 человек и имеет запасы примерно на 3 года. Проблема в том, что его вентиляционная шахта соединена со старой канализационной линией, и она превратилась в магистраль для крыс и тараканов. Они забираются в продовольственные запасы, перегрызают проводку и появляются на нарах по ночам. Борьба с грызунами и насекомыми стала здесь ежедневной обязанностью, которую никто не может позволить себе игнорировать.',
  },
  theme: {
    primaryColor: '#6E8F5C',
    accentColor: '#9BB587',
    bgColor: '#071a0e',
    surfaceColor: '#0f2d1a',
    textColor: '#bbf7d0',
    glowColor: 'rgba(110,143,92,0.3)',
    icon: '🦠',
    backgroundFx: 'bio-pulse',
  },
  cardCategories: [
    { id: 'profession', name: { en: 'Profession', ru: 'Профессия' }, icon: '💼' },
    { id: 'immunity', name: { en: 'Immunity', ru: 'Иммунитет' }, icon: '🛡️' },
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
      { label: { en: 'Virologist', ru: 'Вирусолог' }, description: { en: 'Studies viruses — may find a cure', ru: 'Изучает вирусы — может найти лечение' } },
      { label: { en: 'Nurse', ru: 'Медсестра/медбрат' }, description: { en: 'Frontline medical care experience', ru: 'Опыт медицинской помощи на переднем крае' } },
      { label: { en: 'Biochemist', ru: 'Биохимик' }, description: { en: 'Can synthesize antivirals with basic equipment', ru: 'Может синтезировать противовирусные препараты с базовым оборудованием' } },
      { label: { en: 'Organic Farmer', ru: 'Фермер-органик' }, description: { en: 'Self-sufficient food production', ru: 'Самодостаточное производство продовольствия' } },
      { label: { en: 'Epidemiologist', ru: 'Эпидемиолог' }, description: { en: 'Tracks and contains disease spread', ru: 'Отслеживает и сдерживает распространение болезней' } },
      { label: { en: 'Psychologist', ru: 'Психолог' }, description: { en: 'Manages pandemic anxiety and trauma', ru: 'Управляет тревогой и травмами от пандемии' } },
      { label: { en: 'Chemist', ru: 'Химик' }, description: { en: 'Produces disinfectants and medicines', ru: 'Производит дезинфицирующие средства и лекарства' } },
      { label: { en: 'Geneticist', ru: 'Генетик' }, description: { en: 'Can decode the pathogen genome', ru: 'Может декодировать геном патогена' } },
      { label: { en: 'Surgeon', ru: 'Хирург' }, description: { en: 'Handles complications from infection', ru: 'Справляется с осложнениями от инфекции' } },
      { label: { en: 'Sanitation Engineer', ru: 'Инженер-санитарщик' }, description: { en: 'Maintains sterile bunker environment', ru: 'Поддерживает стерильность бункера' } },
    ],
    immunity: [
      { label: { en: 'Naturally immune — tested', ru: 'Природный иммунитет — проверено' }, description: { en: 'Confirmed immune to the pathogen', ru: 'Подтверждённый иммунитет к патогену' } },
      { label: { en: 'Vaccinated (experimental)', ru: 'Вакцинирован (экспериментально)' }, description: { en: 'Partial protection — effectiveness unclear', ru: 'Частичная защита — эффективность неясна' } },
      { label: { en: 'Compromised immune system', ru: 'Ослабленный иммунитет' }, description: { en: 'High-risk, requires constant monitoring', ru: 'Группа риска, требует постоянного наблюдения' } },
      { label: { en: 'Blood type O negative', ru: 'Группа крови O отрицательная' }, description: { en: 'Universal donor — vital for the group', ru: 'Универсальный донор — жизненно важен для группы' } },
      { label: { en: 'No data available', ru: 'Нет данных' }, description: { en: 'Was not tested before entering — unknown risk', ru: 'Не прошёл тест перед входом — неизвестный риск' } },
      { label: { en: 'Proven survivor (was infected, recovered)', ru: 'Доказанный выживший (переболел)' }, description: { en: 'Has antibodies — may have long immunity', ru: 'Имеет антитела — возможно долгосрочный иммунитет' } },
      { label: { en: 'Strong baseline health', ru: 'Крепкое базовое здоровье' }, description: { en: 'Good resistance, no chronic conditions', ru: 'Хорошая сопротивляемость, нет хронических заболеваний' } },
      { label: { en: 'Allergic to the vaccine', ru: 'Аллергия на вакцину' }, description: { en: 'Cannot be vaccinated — permanent exposure risk', ru: 'Нельзя вакцинировать — постоянный риск заражения' } },
    ],
    hobby: [
      { label: { en: 'Medical herbalism', ru: 'Медицинская фитотерапия' }, description: { en: 'Natural remedies for symptom relief', ru: 'Природные средства для облегчения симптомов' } },
      { label: { en: 'Ham radio', ru: 'Радиолюбитель' }, description: { en: 'Contacts other survivor groups', ru: 'Связывается с другими группами выживших' } },
      { label: { en: 'Yoga and meditation', ru: 'Йога и медитация' }, description: { en: 'Keeps the group calm during crisis', ru: 'Поддерживает спокойствие группы в кризис' } },
      { label: { en: 'Hydroponic gardening', ru: 'Гидропоника' }, description: { en: 'Indoor food growing without soil', ru: 'Выращивание еды в помещении без земли' } },
      { label: { en: 'Chemistry experiments', ru: 'Химические эксперименты' }, description: { en: 'Practical lab skills for synthesis', ru: 'Практические лабораторные навыки для синтеза' } },
      { label: { en: 'Writing and journaling', ru: 'Писательство и ведение дневника' }, description: { en: 'Records knowledge for future generations', ru: 'Записывает знания для будущих поколений' } },
      { label: { en: 'Competitive chess', ru: 'Шахматы' }, description: { en: 'Sharp strategic mind under pressure', ru: 'Острый стратегический ум под давлением' } },
      { label: { en: 'Beekeeping', ru: 'Пчеловодство' }, description: { en: 'Honey as medicine and food source', ru: 'Мёд как лекарство и источник питания' } },
    ],
    phobia: [
      { label: { en: 'Mysophobia (fear of germs)', ru: 'Мизофобия (страх микробов)' }, description: { en: 'Ironically appropriate — but paralyzing in extremes', ru: 'Иронично уместно — но парализует в крайностях' } },
      { label: { en: 'Hypochondria', ru: 'Ипохондрия' }, description: { en: 'Wastes critical medical resources on phantom symptoms', ru: 'Тратит критические медицинские ресурсы на мнимые симптомы' } },
      { label: { en: 'Claustrophobia', ru: 'Клаустрофобия' }, description: { en: 'Long-term bunker life is a crisis', ru: 'Долгосрочная жизнь в бункере — это кризис' } },
      { label: { en: 'Thanatophobia (fear of death)', ru: 'Танатофобия (страх смерти)' }, description: { en: 'Irrational decisions to avoid risk', ru: 'Иррациональные решения во избежание риска' } },
      { label: { en: 'Social anxiety', ru: 'Социальная тревожность' }, description: { en: 'Struggles with the forced closeness of bunker life', ru: 'Трудно справляется с вынужденной теснотой в бункере' } },
      { label: { en: 'Agoraphobia (fear of open spaces)', ru: 'Агорафобия' }, description: { en: 'Actually thrives in the bunker — no open spaces here', ru: 'Хорошо себя чувствует в бункере — нет открытых пространств' } },
      { label: { en: 'Needle phobia', ru: 'Боязнь игл' }, description: { en: 'Refuses injections — vaccines are a problem', ru: 'Отказывается от инъекций — вакцины проблематичны' } },
      { label: { en: 'None — calm under pressure', ru: 'Нет — спокоен под давлением' }, description: { en: 'Unshakeable composure in a crisis', ru: 'Непоколебимое спокойствие в кризисе' } },
    ],
    baggage: [
      { label: { en: 'Full virology lab kit', ru: 'Полный набор вирусологической лаборатории' }, description: { en: 'Research-grade equipment for pathogen study', ru: 'Исследовательское оборудование для изучения патогенов' } },
      { label: { en: '2-year supply of broad-spectrum antibiotics', ru: 'Запас антибиотиков широкого спектра на 2 года' }, description: { en: 'Prevents secondary bacterial infections', ru: 'Предотвращает вторичные бактериальные инфекции' } },
      { label: { en: 'Hazmat suit (full)', ru: 'Полный защитный костюм (хазмат)' }, description: { en: 'Can exit the bunker safely if needed', ru: 'Может безопасно выйти из бункера при необходимости' } },
      { label: { en: 'Seed vault', ru: 'Семенное хранилище' }, description: { en: 'Restart agriculture when it\'s safe', ru: 'Возрождение сельского хозяйства, когда станет безопасно' } },
      { label: { en: 'Blood plasma storage (type O-)', ru: 'Хранилище плазмы крови (0-)' }, description: { en: 'Emergency transfusions for severe infections', ru: 'Экстренные переливания при тяжёлых инфекциях' } },
      { label: { en: 'Water purification kit', ru: 'Набор для очистки воды' }, description: { en: 'Safe drinking water — critical for recovery', ru: 'Безопасная питьевая вода — критически важна для выздоровления' } },
      { label: { en: 'UV sterilization lamps', ru: 'Ультрафиолетовые лампы стерилизации' }, description: { en: 'Decontaminates surfaces and medical equipment', ru: 'Обеззараживает поверхности и медицинское оборудование' } },
      { label: { en: 'Nothing — came with only clothes', ru: 'Ничего — пришёл только с одеждой' }, description: { en: 'One less bag to search for contamination', ru: 'Одним чемоданом меньше для проверки на заражение' } },
    ],
    special_skill: [
      { label: { en: 'Can identify pathogens by symptom pattern', ru: 'Определяет патогены по картине симптомов' }, description: { en: 'Diagnoses without lab equipment', ru: 'Диагностирует без лабораторного оборудования' } },
      { label: { en: 'Trained in decontamination procedures', ru: 'Обучен процедурам деконтаминации' }, description: { en: 'Keeps the bunker clean and sterile', ru: 'Поддерживает чистоту и стерильность бункера' } },
      { label: { en: 'Can manufacture vaccines from animal models', ru: 'Может производить вакцины из животных моделей' }, description: { en: 'Potential cure for future generations', ru: 'Потенциальное лекарство для будущих поколений' } },
      { label: { en: 'Expert in quarantine protocols', ru: 'Эксперт по протоколам карантина' }, description: { en: 'Knows exactly when and how to isolate', ru: 'Точно знает, когда и как изолировать' } },
      { label: { en: 'Can stay calm in biological emergencies', ru: 'Спокоен в биологических чрезвычайных ситуациях' }, description: { en: 'Trained composure that others rely on', ru: 'Тренированное спокойствие, на которое полагаются другие' } },
      { label: { en: 'Fluent in medical Latin', ru: 'Свободно владеет медицинской латынью' }, description: { en: 'Can read any medical textbook or formula', ru: 'Может читать любой медицинский учебник или формулу' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Honest about their limitations', ru: 'Честен о своих ограничениях' } },
    ],
  },
}

export default scenario
