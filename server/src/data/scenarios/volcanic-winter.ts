import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'volcanic-winter',
  title: { en: 'Volcanic Winter', ru: 'Вулканическая зима' },
  catastropheDescription: {
    en: 'A supervolcano erupted. Ash clouds block the sun — temperatures drop 20°C. Surface life will collapse within months.',
    ru: 'Супервулкан извергся. Облака пепла блокируют солнце — температура падает на 20°C. Жизнь на поверхности рухнет за месяцы.',
  },
  story: {
    en: 'A chain of major volcanic eruptions, three of them within the same year, sent enough ash into the atmosphere to block sunlight across entire continents. Temperatures dropped within months, and the ash itself settled over everything, ruining water supplies and collapsing harvests. It wasn\'t the lava or the ash clouds that killed most people, it was the year-long winter that followed, one nobody was prepared for.\n\nThis bunker holds 2 people and has supplies for about 9 years. It sits near an old volcanic vent, dormant for decades but never entirely silent. Every so often, a faint smell of sulfur drifts through the ventilation for a few hours, and the water from the tap comes out slightly cloudy until it clears on its own.',
    ru: 'Серия крупных извержений вулканов — три из них в течение одного года — выбросила в атмосферу столько пепла, что он заблокировал солнечный свет над целыми континентами. Температура упала в течение нескольких месяцев, а сам пепел осел повсюду, отравив запасы воды и погубив урожаи. Большинство людей погубили не лава и не облака пепла, а пришедшая затем многолетняя зима, к которой никто не был готов.\n\nЭтот бункер рассчитан на 2 человек и имеет запасы примерно на 9 лет. Он расположен рядом со старым вулканическим жерлом, дремлющим уже десятилетиями, но никогда полностью не затихающим. Время от времени через вентиляцию на несколько часов проникает едва заметный запах серы, а вода из крана выходит слегка мутной, пока сама не отстоится.',
  },
  theme: {
    primaryColor: '#A8462E',
    accentColor: '#C97758',
    bgColor: '#0a0704',
    surfaceColor: '#1c120a',
    textColor: '#fed7aa',
    glowColor: 'rgba(168,70,46,0.4)',
    icon: '🌋',
    backgroundFx: 'ash-fall',
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
      { label: { en: 'Volcanologist', ru: 'Вулканолог' }, description: { en: 'Predicts future eruption phases', ru: 'Предсказывает будущие фазы извержений' } },
      { label: { en: 'Atmospheric Scientist', ru: 'Учёный-атмосферщик' }, description: { en: 'Tracks ash cloud dispersal and clearing', ru: 'Отслеживает рассеивание и очищение пепельного облака' } },
      { label: { en: 'Geothermal Engineer', ru: 'Геотермальный инженер' }, description: { en: 'Uses volcanic heat for energy', ru: 'Использует вулканическое тепло для энергии' } },
      { label: { en: 'Pulmonologist', ru: 'Пульмонолог' }, description: { en: 'Volcanic ash causes lung damage — critical', ru: 'Вулканический пепел вызывает повреждение лёгких — критически важно' } },
      { label: { en: 'Greenhouse Engineer', ru: 'Инженер тепличного хозяйства' }, description: { en: 'Grows food in artificial environments', ru: 'Выращивает еду в искусственных условиях' } },
      { label: { en: 'Mechanical Engineer', ru: 'Инженер-механик' }, description: { en: 'Keeps equipment running in ash-clogged conditions', ru: 'Поддерживает оборудование в засыпанных пеплом условиях' } },
    ],
    health: [
      { label: { en: 'Respiratory disease (pre-existing)', ru: 'Болезнь органов дыхания (предшествующая)' }, description: { en: 'Volcanic ash is a severe health threat', ru: 'Вулканический пепел — серьёзная угроза здоровью' } },
      { label: { en: 'Perfect lung health', ru: 'Идеальное здоровье лёгких' }, description: { en: 'Can filter ash better than others', ru: 'Может фильтровать пепел лучше других' } },
      { label: { en: 'Excellent cold tolerance', ru: 'Отличная холодоустойчивость' }, description: { en: '-20°C winter is less of a problem', ru: 'Зима при -20°C менее проблематична' } },
      { label: { en: 'Allergic to ash particles', ru: 'Аллергия на частицы пепла' }, description: { en: 'Every surface exit is medically dangerous', ru: 'Каждый выход на поверхность медицински опасен' } },
      { label: { en: 'Physically robust constitution', ru: 'Физически крепкое телосложение' }, description: { en: 'Handles extreme physical labor in cold', ru: 'Справляется с экстремальным физическим трудом в холоде' } },
    ],
    hobby: [
      { label: { en: 'Greenhouse gardening', ru: 'Тепличное садоводство' }, description: { en: 'Grows food in controlled ash-free environment', ru: 'Выращивает еду в контролируемой среде без пепла' } },
      { label: { en: 'Spelunking (cave exploration)', ru: 'Спелеология' }, description: { en: 'Finds geothermal caverns for warmth', ru: 'Находит геотермальные пещеры для тепла' } },
      { label: { en: 'Textile crafting', ru: 'Текстильное ремесло' }, description: { en: 'Makes protective clothing against ash exposure', ru: 'Делает защитную одежду от воздействия пепла' } },
      { label: { en: 'Foraging (mushrooms, fungi)', ru: 'Сбор грибов и грибков' }, description: { en: 'Fungi flourish in volcanic soil conditions', ru: 'Грибы процветают в условиях вулканической почвы' } },
      { label: { en: 'Ham radio', ru: 'Радиолюбитель' }, description: { en: 'Contact survivors past the ash cloud', ru: 'Связь с выжившими по ту сторону пепельного облака' } },
    ],
    phobia: [
      { label: { en: 'Pyrexophobia (fear of volcanoes)', ru: 'Страх вулканов' }, description: { en: 'Hypervigilant about secondary eruptions', ru: 'Гипербдителен в отношении вторичных извержений' } },
      { label: { en: 'Fear of the dark (ash blocks light)', ru: 'Страх темноты (пепел блокирует свет)' }, description: { en: 'The world outside is perpetually dark', ru: 'Мир снаружи вечно тёмный' } },
      { label: { en: 'Claustrophobia', ru: 'Клаустрофобия' }, description: { en: 'Bunker confinement is deeply distressing', ru: 'Заключение в бункере крайне тяжело' } },
      { label: { en: 'None — stoic acceptance', ru: 'Нет — стоическое принятие' }, description: { en: 'The eruption happened. Adapt or perish.', ru: 'Извержение произошло. Адаптируйся или погибни.' } },
    ],
    baggage: [
      { label: { en: 'Industrial air filtration unit', ru: 'Промышленный блок фильтрации воздуха' }, description: { en: 'Keeps ash out of the bunker atmosphere', ru: 'Не пускает пепел в атмосферу бункера' } },
      { label: { en: 'Geothermal drilling kit', ru: 'Набор для геотермального бурения' }, description: { en: 'Taps volcanic heat for unlimited energy', ru: 'Подключается к вулканическому теплу для безлимитной энергии' } },
      { label: { en: 'Grow lights + sealed greenhouse kit', ru: 'Лампы для роста + комплект запечатанной теплицы' }, description: { en: 'Food production independent of surface conditions', ru: 'Производство еды независимо от условий на поверхности' } },
      { label: { en: 'High-quality respirators (10 units)', ru: 'Высококачественные респираторы (10 шт)' }, description: { en: 'Safe surface missions for supply runs', ru: 'Безопасные выходы на поверхность за запасами' } },
      { label: { en: 'Seismograph + volcanic monitoring kit', ru: 'Сейсмограф + набор для мониторинга вулканов' }, description: { en: 'Early warning for secondary eruptions', ru: 'Раннее предупреждение о вторичных извержениях' } },
    ],
    special_skill: [
      { label: { en: 'Reads geological signals for eruption warning', ru: 'Читает геологические сигналы для предупреждения об извержении' }, description: { en: 'Saves the bunker from secondary lava flows', ru: 'Спасает бункер от вторичных лавовых потоков' } },
      { label: { en: 'Expert in volcanic soil agriculture', ru: 'Эксперт по сельскому хозяйству на вулканической почве' }, description: { en: 'Volcanic soil is extremely fertile post-eruption', ru: 'Вулканическая почва чрезвычайно плодородна после извержения' } },
      { label: { en: 'Can survive weeks on minimal rations', ru: 'Может выжить неделями на минимальном пайке' }, description: { en: 'When supply runs fail, they endure', ru: 'Когда вылазки за запасами проваливаются, они выдерживают' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Just hoping to help in some way', ru: 'Просто надеется помочь каким-то образом' } },
    ],
  },
}
export default scenario
