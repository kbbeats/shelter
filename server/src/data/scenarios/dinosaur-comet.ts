import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic {
  cardPool: Record<string, CardTemplate[]>
}

const scenario: ScenarioFull = {
  id: 'dinosaur-comet',
  title: { en: 'Dinosaur Comet', ru: 'Комета динозавров' },
  catastropheDescription: {
    en: 'A massive comet is 3 days from impact. A deep cave system can shelter exactly 4 dinosaurs. The Jurassic Council must decide who enters.',
    ru: 'Огромная комета в 3 днях от удара. Глубокая пещерная система вмещает ровно 4 динозавра. Юрский совет должен решить, кто войдёт.',
  },
  theme: {
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    bgColor: '#100800',
    surfaceColor: '#1c1000',
    textColor: '#fde68a',
    glowColor: 'rgba(217,119,6,0.5)',
    icon: '🦕',
    backgroundFx: 'comet-dust',
  },
  cardCategories: [
    { id: 'role', name: { en: 'Dino Role', ru: 'Роль динозавра' }, icon: '🦕' },
    { id: 'ability', name: { en: 'Natural Ability', ru: 'Природная способность' }, icon: '💪' },
    { id: 'weakness', name: { en: 'Weakness', ru: 'Слабость' }, icon: '😰' },
    { id: 'territory', name: { en: 'Territory', ru: 'Территория' }, icon: '🌋' },
    { id: 'herd_role', name: { en: 'Herd Role', ru: 'Роль в стаде' }, icon: '🦖' },
    { id: 'secret_trait', name: { en: 'Secret Trait', ru: 'Тайное качество' }, icon: '🔮' },
  ],
  isPremium: false,
  minPlayers: 3,
  maxPlayers: 12,
  cardPool: {
    role: [
      { label: { en: 'Tail Groomer', ru: 'Чистильщик хвостов' }, description: { en: 'Parasite removal specialist — prevents disease in the cave', ru: 'Специалист по удалению паразитов — предотвращает болезни в пещере' } },
      { label: { en: 'Attorney for Rex', ru: 'Адвокат Рекса' }, description: { en: 'Negotiates disputes between dinos with iron logic', ru: 'Улаживает споры между динозаврами железной логикой' } },
      { label: { en: 'Egg Incubator', ru: 'Инкубатор яиц' }, description: { en: 'Maintains optimal temperature for all eggs', ru: 'Поддерживает оптимальную температуру для всех яиц' } },
      { label: { en: 'Herd Lookout', ru: 'Страж стада' }, description: { en: '360-degree vision, spots predators at 2km', ru: 'Обзор 360°, замечает хищников за 2 км' } },
      { label: { en: 'Berry Finder', ru: 'Искатель ягод' }, description: { en: 'Locates food sources no others can smell', ru: 'Находит источники пищи, которые другие не чуют' } },
      { label: { en: 'Mud Roller', ru: 'Катальщик в грязи' }, description: { en: 'Expert in parasitic repellent mud application', ru: 'Эксперт по нанесению антипаразитарной грязи' } },
      { label: { en: 'Thunderfoot Chief', ru: 'Вождь Громовых Лап' }, description: { en: 'Commands respect — stabilizes group hierarchy', ru: 'Вызывает уважение — стабилизирует иерархию группы' } },
      { label: { en: 'Rock Shaper', ru: 'Камнетёс' }, description: { en: 'Can modify the cave with tail and claws', ru: 'Может преобразовать пещеру хвостом и когтями' } },
      { label: { en: 'Night Screamer', ru: 'Ночной крикун' }, description: { en: 'Communicates over 10km — essential for coordination', ru: 'Общается на расстоянии 10 км — необходим для координации' } },
      { label: { en: 'Cave Mapper', ru: 'Картограф пещер' }, description: { en: 'Has memorized every tunnel in the cave system', ru: 'Запомнил каждый тоннель пещерной системы' } },
    ],
    ability: [
      { label: { en: 'Can smell rain 3 days in advance', ru: 'Чует дождь за 3 дня' }, description: { en: 'Weather prediction for cave exit timing', ru: 'Прогноз погоды для выбора времени выхода из пещеры' } },
      { label: { en: 'Echolocation', ru: 'Эхолокация' }, description: { en: 'Navigates the cave in complete darkness', ru: 'Ориентируется в пещере в полной темноте' } },
      { label: { en: 'Night vision', ru: 'Ночное зрение' }, description: { en: 'Sees perfectly in the dark cave', ru: 'Отлично видит в тёмной пещере' } },
      { label: { en: '3× speed over short distances', ru: 'Утроенная скорость на коротких дистанциях' }, description: { en: 'Can escape threats faster than any other dino', ru: 'Убегает от угроз быстрее любого другого динозавра' } },
      { label: { en: 'Photosynthetic skin scales', ru: 'Фотосинтетическая кожа' }, description: { en: 'Partially self-sustaining — needs less food', ru: 'Частично самодостаточен — нуждается в меньшем количестве еды' } },
      { label: { en: 'Can hold breath for 40 minutes', ru: 'Может задерживать дыхание на 40 минут' }, description: { en: 'Survives flooded cave sections', ru: 'Выживает в затопленных секциях пещеры' } },
      { label: { en: 'Temperature regulation', ru: 'Терморегуляция' }, description: { en: 'Comfortable from -10°C to 60°C', ru: 'Комфортно при температуре от -10°C до 60°C' } },
      { label: { en: 'Magnetic navigation', ru: 'Магнитная навигация' }, description: { en: 'Never gets lost, even underground', ru: 'Никогда не теряется, даже под землёй' } },
    ],
    weakness: [
      { label: { en: 'Terrified of small mammals', ru: 'Панически боится мелких млекопитающих' }, description: { en: 'Screams at mice — a problem in caves', ru: 'Кричит от мышей — проблема в пещерах' } },
      { label: { en: 'Allergic to ferns', ru: 'Аллергия на папоротники' }, description: { en: 'Sneezes uncontrollably near underground plants', ru: 'Неудержимо чихает рядом с подземными растениями' } },
      { label: { en: 'Cannot swim', ru: 'Не умеет плавать' }, description: { en: 'Flooded cave passages are impassable', ru: 'Затопленные проходы пещеры непреодолимы' } },
      { label: { en: 'Needs 30kg of food daily', ru: 'Нуждается в 30 кг еды ежедневно' }, description: { en: 'Will deplete cave food stores rapidly', ru: 'Быстро опустошит запасы еды в пещере' } },
      { label: { en: 'Loud sleeper — snores like thunder', ru: 'Громко спит — храпит как гром' }, description: { en: 'Will attract predators and ruin group sleep', ru: 'Привлечёт хищников и нарушит сон группы' } },
      { label: { en: 'Hopelessly clumsy in tight spaces', ru: 'Безнадёжно неуклюж в тесных пространствах' }, description: { en: 'Keeps knocking stalactites down', ru: 'Постоянно сбивает сталактиты' } },
      { label: { en: 'Obsessed with collecting shiny rocks', ru: 'Одержим коллекционированием блестящих камней' }, description: { en: 'Wastes space and loses focus at critical moments', ru: 'Тратит место и теряет концентрацию в критические моменты' } },
      { label: { en: 'No known weaknesses — suspiciously perfect', ru: 'Нет известных слабостей — подозрительно совершенен' }, description: { en: 'Something must be hiding...', ru: 'Что-то точно скрывается...' } },
    ],
    territory: [
      { label: { en: 'Swamp dweller — knows all water sources', ru: 'Житель болот — знает все источники воды' }, description: { en: 'Critical for hydration in the cave', ru: 'Критически важно для гидратации в пещере' } },
      { label: { en: 'Mountain climber', ru: 'Скалолаз' }, description: { en: 'Can scout from high ground for safety', ru: 'Может разведывать с высоты для безопасности' } },
      { label: { en: 'Deep forest navigator', ru: 'Навигатор тёмного леса' }, description: { en: 'Expert in foraging underground fungi', ru: 'Эксперт по сбору подземных грибов' } },
      { label: { en: 'Desert adapted', ru: 'Адаптирован к пустыне' }, description: { en: 'Survives with minimal water — saves resources', ru: 'Выживает с минимумом воды — экономит ресурсы' } },
      { label: { en: 'Cave specialist (already lives underground)', ru: 'Специалист по пещерам (уже живёт под землёй)' }, description: { en: 'Home advantage — knows cave living intimately', ru: 'Преимущество дома — отлично знает пещерную жизнь' } },
      { label: { en: 'Coastal dinosaur', ru: 'Прибрежный динозавр' }, description: { en: 'Expert swimmer and fish catcher', ru: 'Отличный пловец и рыболов' } },
      { label: { en: 'Volcanic zone resident', ru: 'Житель вулканической зоны' }, description: { en: 'Heat-tolerant, useful near geothermal vents', ru: 'Теплоустойчив, полезен рядом с геотермальными вентами' } },
    ],
    herd_role: [
      { label: { en: 'Alpha — makes final decisions', ru: 'Альфа — принимает окончательные решения' }, description: { en: 'Natural authority, but can be rigid', ru: 'Природный авторитет, но может быть жёстким' } },
      { label: { en: 'Omega — keeps peace in the group', ru: 'Омега — поддерживает мир в группе' }, description: { en: 'Absorbs tension, prevents fights', ru: 'Поглощает напряжение, предотвращает драки' } },
      { label: { en: 'Loner — independent survivor', ru: 'Одиночка — независимый выживший' }, description: { en: 'Works best alone, but contributes unique perspective', ru: 'Лучше работает в одиночку, но вносит уникальный вклад' } },
      { label: { en: 'Caretaker of young', ru: 'Опекун молодняка' }, description: { en: 'Protects and nurtures future generation', ru: 'Защищает и воспитывает будущее поколение' } },
      { label: { en: 'Healer — uses plants and mud', ru: 'Целитель — использует растения и грязь' }, description: { en: 'Traditional dino medicine that actually works', ru: 'Традиционная медицина динозавров, которая работает' } },
      { label: { en: 'Scout — always first into danger', ru: 'Разведчик — всегда первым идёт в опасность' }, description: { en: 'Brave and quick, but reckless', ru: 'Смелый и быстрый, но безрассудный' } },
    ],
    secret_trait: [
      { label: { en: 'Secretly evolved opposable thumbs', ru: 'Тайно эволюционировал противопоставляемые большие пальцы' }, description: { en: 'Can use primitive tools — evolution accelerated', ru: 'Может использовать примитивные инструменты — эволюция ускорилась' } },
      { label: { en: 'Has already found the cave entrance', ru: 'Уже нашёл вход в пещеру' }, description: { en: 'Knows exactly where it is — leverage', ru: 'Точно знает, где он — рычаг влияния' } },
      { label: { en: 'Immune to comet dust', ru: 'Иммунитет к пыли кометы' }, description: { en: 'Unique biology resists the impact fallout', ru: 'Уникальная биология противостоит последствиям удара' } },
      { label: { en: 'Can predict the comet\'s exact strike zone', ru: 'Может предсказать точную зону удара кометы' }, description: { en: 'Astronomical instinct — knows safe zones', ru: 'Астрономический инстинкт — знает безопасные зоны' } },
      { label: { en: 'Has mated — eggs are coming', ru: 'Размножился — яйца на подходе' }, description: { en: 'Bringing future life... but also more mouths', ru: 'Несёт будущую жизнь... но и больше ртов' } },
      { label: { en: 'Carries a rare medicinal fungus', ru: 'Несёт редкий лечебный гриб' }, description: { en: 'Cures infections no other remedy can touch', ru: 'Лечит инфекции, с которыми ничто другое не справится' } },
      { label: { en: 'No secret — completely transparent', ru: 'Нет секретов — полностью прозрачен' }, description: { en: 'What you see is all there is — boring but trustworthy', ru: 'Всё как есть — скучно, но надёжно' } },
    ],
  },
}

export default scenario
