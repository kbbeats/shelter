import type { ScenarioPublic, BilingualText } from '@shelter/shared'

interface CardTemplate { label: BilingualText; description: BilingualText }
interface ScenarioFull extends ScenarioPublic { cardPool: Record<string, CardTemplate[]> }

const scenario: ScenarioFull = {
  id: 'solar-flare',
  title: { en: 'Solar Flare', ru: 'Вспышка на Солнце' },
  catastropheDescription: {
    en: 'A coronal mass ejection wiped all electronics. Civilization has reset to 1800. The bunker, built with analog systems, is the last organized refuge.',
    ru: 'Корональный выброс уничтожил всю электронику. Цивилизация откатилась к 1800-м. Бункер с аналоговыми системами — последнее организованное убежище.',
  },
  story: {
    en: 'A series of massive solar flares hit the planet within days of each other, far stronger than anything on record. The resulting surges knocked out power grids, satellites, and most electronics across entire hemispheres, almost all at once. Without power, water treatment, communication, and supply chains broke down faster than anyone could respond. The flares themselves only lasted hours, but the damage they caused didn\'t stop there.\n\nThis bunker holds 2 people and has supplies for about 10 years. The surge damaged the timer that controls the backup lighting, so the "day" and "night" cycle down here no longer matches 24 hours, sometimes longer, sometimes shorter, and it drifts a little more each week. Nobody\'s been able to reset it.',
    ru: 'Серия мощных солнечных вспышек обрушилась на планету с разницей в несколько дней — сильнее всего, что было зафиксировано ранее. Возникшие из-за них перенапряжения вывели из строя энергосети, спутники и большую часть электроники сразу на нескольких полушариях. Без электричества системы водоочистки, связи и поставок рухнули быстрее, чем кто-либо успел отреагировать. Сами вспышки продолжались всего несколько часов, но причинённый ими урон этим не ограничился.\n\nЭтот бункер рассчитан на 2 человек и имеет запасы примерно на 10 лет. Скачок напряжения повредил таймер, управляющий резервным освещением, поэтому цикл «дня» и «ночи» здесь больше не соответствует 24 часам — то длиннее, то короче — и расхождение немного нарастает каждую неделю. Сбросить его настройки пока никому не удалось.',
  },
  theme: {
    primaryColor: '#B5651D',
    accentColor: '#D38A4A',
    bgColor: '#0c0900',
    surfaceColor: '#1c1500',
    textColor: '#fef3c7',
    glowColor: 'rgba(181,101,29,0.5)',
    icon: '☀️',
    backgroundFx: 'emp-flicker',
  },
  cardCategories: [
    { id: 'profession', name: { en: 'Profession', ru: 'Профессия' }, icon: '💼' },
    { id: 'pre_digital_knowledge', name: { en: 'Pre-Digital Knowledge', ru: 'Доцифровые знания' }, icon: '📚' },
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
      { label: { en: 'Blacksmith', ru: 'Кузнец' }, description: { en: 'Crafts tools and weapons without electricity', ru: 'Куёт инструменты и оружие без электричества' } },
      { label: { en: 'Physician (traditional methods)', ru: 'Врач (традиционные методы)' }, description: { en: 'Practices medicine as in 1850', ru: 'Практикует медицину как в 1850 году' } },
      { label: { en: 'Farmer', ru: 'Фермер' }, description: { en: 'Manual agriculture without any machines', ru: 'Ручное сельское хозяйство без машин' } },
      { label: { en: 'Miller', ru: 'Мельник' }, description: { en: 'Processes grain — food production backbone', ru: 'Перерабатывает зерно — основа производства еды' } },
      { label: { en: 'Carpenter', ru: 'Плотник' }, description: { en: 'Builds essential structures with hand tools', ru: 'Строит необходимые конструкции вручную' } },
      { label: { en: 'Herbalist', ru: 'Травник' }, description: { en: 'Natural medicine without pharma supply chains', ru: 'Натуральная медицина без фармацевтических цепочек поставок' } },
      { label: { en: 'Astronomer', ru: 'Астроном' }, description: { en: 'Navigation and time-keeping by celestial bodies', ru: 'Навигация и ведение времени по небесным телам' } },
      { label: { en: 'Military Commander', ru: 'Военный командир' }, description: { en: 'Organizes defense without communication systems', ru: 'Организует защиту без систем связи' } },
    ],
    pre_digital_knowledge: [
      { label: { en: 'Can build a steam engine', ru: 'Может построить паровой двигатель' }, description: { en: 'Industrial revolution — restart civilization faster', ru: 'Промышленная революция — перезапустить цивилизацию быстрее' } },
      { label: { en: 'Knows pre-industrial farming techniques', ru: 'Знает доиндустриальные методы земледелия' }, description: { en: 'Food security without modern equipment', ru: 'Продовольственная безопасность без современного оборудования' } },
      { label: { en: 'Can read celestial navigation charts', ru: 'Может читать карты для навигации по небесным телам' }, description: { en: 'No GPS — stars are the only maps', ru: 'GPS нет — звёзды единственные карты' } },
      { label: { en: 'Knows herbal medicine formulations', ru: 'Знает составы травяных лекарств' }, description: { en: 'Medicine that works without refrigeration or electricity', ru: 'Лекарство, работающее без холодильника и электричества' } },
      { label: { en: 'Expert in manual metalworking', ru: 'Эксперт по ручной металлообработке' }, description: { en: 'Manufactures parts and tools from raw materials', ru: 'Изготавливает детали и инструменты из сырья' } },
      { label: { en: 'No pre-digital knowledge', ru: 'Нет доцифровых знаний' }, description: { en: 'Born 100% dependent on technology', ru: 'Рождён со 100% зависимостью от технологий' } },
    ],
    hobby: [
      { label: { en: 'Blacksmithing (amateur)', ru: 'Кузнечное дело (любительское)' }, description: { en: 'Can forge basic tools and hardware', ru: 'Может ковать базовые инструменты и фурнитуру' } },
      { label: { en: 'Candle and soap making', ru: 'Изготовление свечей и мыла' }, description: { en: 'Light and hygiene without power', ru: 'Свет и гигиена без электричества' } },
      { label: { en: 'Brewing and fermentation', ru: 'Варка и ферментация' }, description: { en: 'Water purification through alcohol', ru: 'Очистка воды через алкоголь' } },
      { label: { en: 'Leather crafting', ru: 'Кожевничество' }, description: { en: 'Durable clothing and equipment without factories', ru: 'Прочная одежда и снаряжение без фабрик' } },
      { label: { en: 'Horse riding and care', ru: 'Верховая езда и уход за лошадьми' }, description: { en: 'Transportation in a world without fuel', ru: 'Транспорт в мире без топлива' } },
    ],
    phobia: [
      { label: { en: 'Fear of the dark (no electricity)', ru: 'Страх темноты (нет электричества)' }, description: { en: 'Night time is constant darkness now', ru: 'Ночь теперь постоянная темнота' } },
      { label: { en: 'Technology withdrawal anxiety', ru: 'Тревожность от цифровой зависимости' }, description: { en: 'Debilitating distress without phones/screens', ru: 'Изнуряющий стресс без телефонов/экранов' } },
      { label: { en: 'Fear of manual labor', ru: 'Страх физического труда' }, description: { en: 'Life is now entirely manual — psychological barrier', ru: 'Жизнь теперь полностью ручная — психологический барьер' } },
      { label: { en: 'None — romanticized this era', ru: 'Нет — романтизировал эту эпоху' }, description: { en: 'Has been preparing for this accidentally', ru: 'Готовился к этому случайно' } },
    ],
    baggage: [
      { label: { en: 'Complete reference library (pre-1900 techniques)', ru: 'Полная справочная библиотека (техники до 1900 г.)' }, description: { en: 'Encyclopedia of how to rebuild without electricity', ru: 'Энциклопедия того, как восстановить без электричества' } },
      { label: { en: 'Hand tools (full carpenter\'s set)', ru: 'Ручные инструменты (полный плотницкий набор)' }, description: { en: 'Build and repair everything manually', ru: 'Строить и ремонтировать всё вручную' } },
      { label: { en: 'Seed bank + farming almanac', ru: 'Семенной банк + фермерский альманах' }, description: { en: 'Food production calendar for manual farming', ru: 'Календарь производства еды для ручного земледелия' } },
      { label: { en: 'Horse and saddle', ru: 'Лошадь и седло' }, description: { en: 'Mobility and carrying capacity in a fuel-free world', ru: 'Мобильность и грузоподъёмность в мире без топлива' } },
      { label: { en: 'Oil lamps + flint fire kit', ru: 'Масляные лампы + кресальный набор' }, description: { en: 'Light and heat without electricity', ru: 'Свет и тепло без электричества' } },
    ],
    special_skill: [
      { label: { en: 'Can rebuild a power grid with salvage', ru: 'Может восстановить электросеть из подручных материалов' }, description: { en: 'Potential to restart modern civilization', ru: 'Потенциал для перезапуска современной цивилизации' } },
      { label: { en: 'Expert in self-sufficient homesteading', ru: 'Эксперт по самодостаточному фермерству' }, description: { en: 'Zero-dependency survival model', ru: 'Модель выживания с нулевой зависимостью' } },
      { label: { en: 'Can teach 19th century skills to anyone', ru: 'Может обучить навыкам XIX века кого угодно' }, description: { en: 'Accelerates the group\'s adaptation to no-tech life', ru: 'Ускоряет адаптацию группы к жизни без технологий' } },
      { label: { en: 'No special skill', ru: 'Нет особых навыков' }, description: { en: 'Was entirely dependent on modern technology', ru: 'Был полностью зависим от современных технологий' } },
    ],
  },
}
export default scenario
