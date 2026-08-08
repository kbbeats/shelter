/**
 * PRESERVED 18+ CARD CONTENT — NOT WIRED INTO THE LIVE GAME.
 *
 * This file holds the sexual/adult-industry-themed cards that were removed from every
 * scenario's live `cardPool` as part of a family-friendly content pass. Nothing in this
 * file is imported or referenced anywhere in the running game — it exists purely as a
 * preservation record in case a future opt-in "mature mode" toggle is built.
 *
 * Do not import this file into scenario data, CardDealer, or anything else that runs
 * during actual gameplay.
 */

import type { BilingualText, SpecialAbilityEffectType } from '@shelter/shared'

interface CardTemplate {
  label: BilingualText
  description: BilingualText
  effectType?: SpecialAbilityEffectType
  targetType?: 'self' | 'other' | 'none'
}

export const matureContent: Record<string, Record<string, CardTemplate[]>> = {
  'nuclear-war': {
    occupation: [
      { label: { en: 'Stripper', ru: 'Стриптизёр(ша)' }, description: { en: 'Surprisingly strong core and stamina from years of physical performance', ru: 'Удивительно крепкий корпус и выносливость после лет физических выступлений' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Skilled at lighting, editing, and improvising with limited equipment', ru: 'Умеет работать со светом, монтажом и импровизировать с ограниченным оборудованием' } },
    ],
    hobby: [
      { label: { en: 'Nudist', ru: 'Нудист(ка)' }, description: { en: 'Completely unbothered by the bunker\'s cramped, exposed living quarters', ru: 'Совершенно не смущается тесных и открытых жилых помещений бункера' } },
    ],
    fun_fact_1: [
      { label: { en: 'Secretly has an OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'Surprisingly good with cameras and self-promotion', ru: 'Удивительно хорошо разбирается в камерах и самопрезентации' } },
      { label: { en: 'Nymphomaniac', ru: 'Нимфоман(ка)' }, description: { en: 'High libido — could be a bonding tool or a source of tension', ru: 'Высокое либидо — может сближать пару или создавать напряжение' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды переспал(а) с не очень известной звездой' }, description: { en: 'Has a wild story to tell during the long years ahead', ru: 'Есть дикая история на долгие годы вперёд' } },
    ],
    fun_fact_2: [
      { label: { en: 'Picked up a kink for roleplay during lockdowns', ru: 'Во время локдаунов пристрастился(ась) к ролевым играм' }, description: { en: 'Knows how to make long, dull stretches of time more interesting', ru: 'Умеет делать долгие скучные периоды времени интереснее' } },
    ],
  },
  pandemic: {
    occupation: [
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Knows how to keep morale up during long isolation', ru: 'Умеет поддерживать моральный дух во время долгой изоляции' } },
      { label: { en: 'Sex Therapist', ru: 'Секс-терапевт' }, description: { en: 'Helps the group manage stress and intimacy in close quarters', ru: 'Помогает группе справляться со стрессом и близостью в тесноте' } },
    ],
    hobby: [
      { label: { en: 'Pole dancing / burlesque', ru: 'Пол-дэнс / бурлеск' }, description: { en: 'Surprisingly great for fitness and morale in tight spaces', ru: 'Неожиданно хорошо для формы и настроения в тесном пространстве' } },
    ],
    fun_fact_1: [
      { label: { en: 'Secretly has an OnlyFans account', ru: 'Тайно ведёт аккаунт на OnlyFans' }, description: { en: 'Used to be a decent side income before the world ended', ru: 'Раньше был неплохим дополнительным доходом' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды провёл ночь с не очень известной звездой' }, description: { en: 'Loves bringing it up at the worst times', ru: 'Любит упоминать это в самые неподходящие моменты' } },
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка/нимфоман' }, description: { en: 'Struggles with the close quarters in more ways than one', ru: 'Тесное пространство создаёт для них особые сложности' } },
    ],
    fun_fact_2: [
      { label: { en: 'Once flashed an entire stadium on a dare', ru: 'Однажды разделся(ась) перед целым стадионом на спор' }, description: { en: 'Has zero modesty left to lose', ru: 'У них уже не осталось стеснительности' } },
      { label: { en: 'Practiced polyamory before the outbreak', ru: 'До эпидемии практиковал(а) полиаморию' }, description: { en: 'Comfortable navigating complicated group dynamics', ru: 'Спокойно справляется со сложной групповой динамикой' } },
    ],
  },
  'ai-takeover': {
    occupation: [
      { label: { en: 'Cam Performer', ru: 'Кам-модель' }, description: { en: 'Used to working long isolated hours alone — and reading people through a screen', ru: 'Привык(ла) к долгим часам в одиночестве — и умеет читать людей через экран' } },
      { label: { en: 'Sex Therapist', ru: 'Секс-терапевт' }, description: { en: 'Trained to keep a tense, isolated group emotionally functional', ru: 'Обучен(а) поддерживать эмоциональную стабильность в замкнутой напряжённой группе' } },
    ],
    hobby: [
      { label: { en: 'Nudist', ru: 'Нудист(ка)' }, description: { en: 'Has zero issue with cramped quarters and no privacy', ru: 'Совершенно не смущается тесноты и отсутствия личного пространства' } },
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск-танцы' }, description: { en: 'Keeps the bunker\'s spirits — and confidence — up', ru: 'Поднимает настроение и уверенность всех в бункере' } },
    ],
    fun_fact_1: [
      { label: { en: 'Has a secret OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'No internet down here — but the memory lingers', ru: 'Здесь нет интернета — но воспоминания остаются' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды переспал(а) с не очень известной звездой' }, description: { en: 'Tells the story differently every time', ru: 'Каждый раз рассказывает эту историю по-новому' } },
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка/Нимфоман' }, description: { en: 'Cramped quarters are... an adjustment', ru: 'Тесные помещения требуют... привыкания' } },
    ],
    fun_fact_2: [
      { label: { en: 'Polyamorous', ru: 'Полиаморен/полиаморна' }, description: { en: 'Open about relationship structure since long before the bunker', ru: 'Открыто говорит о своих отношениях задолго до бункера' } },
    ],
  },
  'asteroid-impact': {
    occupation: [
      { label: { en: 'Stripper', ru: 'Стриптизёр(ша)' }, description: { en: 'Knows how to keep morale up when everyone is on edge', ru: 'Умеет поднимать боевой дух, когда все на нервах' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Surprisingly good at improvising with limited equipment', ru: 'Удивительно хорошо импровизирует с ограниченным оборудованием' } },
    ],
    hobby: [
      { label: { en: 'Nudist', ru: 'Нудист(ка)' }, description: { en: 'Completely unbothered by close quarters', ru: 'Совершенно не смущается тесноты бункера' } },
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск-танцы' }, description: { en: 'Lifts spirits during the long dark months', ru: 'Поднимает настроение в долгие тёмные месяцы' } },
    ],
    fun_fact_1: [
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка(н)' }, description: { en: 'Restless energy in tight quarters', ru: 'Неуёмная энергия в тесном пространстве' } },
      { label: { en: 'Secretly has an OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'Used to supplement income before the impact', ru: 'Подрабатывал так до удара астероида' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды переспал(а) с не очень известной звездой' }, description: { en: 'A fun story for the long winter nights', ru: 'Забавная история для долгих зимних ночей' } },
    ],
    fun_fact_2: [
      { label: { en: 'Exhibitionist tendencies', ru: 'Склонность к эксгибиционизму' }, description: { en: 'Privacy in the bunker is already scarce', ru: 'В бункере и без того мало приватности' } },
      { label: { en: 'Has a polyamorous relationship history', ru: 'В прошлом состоял(а) в полиаморных отношениях' }, description: { en: 'Comfortable with unconventional group dynamics', ru: 'Спокойно относится к нестандартной групповой динамике' } },
    ],
  },
  'climate-collapse': {
    occupation: [
      { label: { en: 'Sex Therapist', ru: 'Секс-терапевт' }, description: { en: 'Keeps morale and relationships stable under prolonged close quarters', ru: 'Поддерживает моральный дух и отношения в условиях долгой тесноты' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Surprisingly good at improvising with limited equipment and keeping spirits up', ru: 'Неожиданно хорошо импровизирует с ограниченным оборудованием и поднимает настроение' } },
    ],
    hobby: [
      { label: { en: 'Nudist', ru: 'Нудист' }, description: { en: 'Already comfortable with cramped, sweaty bunker life', ru: 'Уже привык к тесной и влажной жизни в бункере' } },
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск-танцы' }, description: { en: 'Keeps morale high during long, humid nights underground', ru: 'Поддерживает боевой дух в долгие влажные ночи под землёй' } },
    ],
    fun_fact_1: [
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка(к)' }, description: { en: 'Close quarters have been... an adjustment for everyone', ru: 'Теснота бункера стала для всех своеобразным испытанием' } },
      { label: { en: 'Secretly has an OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'Used to fund a very nice emergency kit before the floods', ru: 'На эти деньги был куплен отличный аварийный набор до потопа' } },
      { label: { en: 'Slept with a minor celebrity', ru: 'Спал(а) с не очень известной звездой' }, description: { en: 'Tells the story slightly differently every time', ru: 'Каждый раз рассказывает эту историю немного иначе' } },
    ],
    fun_fact_2: [
      { label: { en: 'Once streaked at a public event', ru: 'Однажды пробежал(а) голышом на публичном мероприятии' }, description: { en: 'Still mortified when reminded', ru: 'До сих пор смущается при напоминании' } },
    ],
  },
  'solar-flare': {
    occupation: [
      { label: { en: 'Stripper', ru: 'Стриптизёр(ша)' }, description: { en: 'Surprisingly good at reading a room and keeping morale up in the dark', ru: 'Неожиданно хорошо чувствует настроение группы и поднимает боевой дух в темноте' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Knows how to keep two people entertained with very little equipment', ru: 'Знает, как развлечь двоих с минимумом оборудования' } },
    ],
    hobby: [
      { label: { en: 'Nudist', ru: 'Нудист(ка)' }, description: { en: 'Comfortable in their own skin — and unbothered when laundry runs low', ru: 'Чувствует себя комфортно без одежды — не паникует, когда заканчивается чистое бельё' } },
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск-танцы' }, description: { en: 'Brings flair and confidence to an otherwise grim routine', ru: 'Добавляет изюминку и уверенность в унылую рутину' } },
    ],
    fun_fact_1: [
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка' }, description: { en: 'Boredom in the bunker is rarely a problem for them', ru: 'Скука в бункере для них редко становится проблемой' } },
      { label: { en: 'Secretly had an OnlyFans before the flare', ru: 'До вспышки тайно вёл(а) OnlyFans' }, description: { en: 'A strange thing to be known for in a world without internet now', ru: 'Странно, чем теперь известен в мире без интернета' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды переспал(а) с не очень известной знаменитостью' }, description: { en: 'A fun story that means absolutely nothing now', ru: 'Забавная история, которая теперь не имеет никакого значения' } },
    ],
    fun_fact_2: [
      { label: { en: 'Exhibitionist tendencies', ru: 'Склонность к эксгибиционизму' }, description: { en: 'Privacy in the bunker is already in short supply', ru: 'Приватности в бункере и без того не хватает' } },
    ],
  },
  'volcanic-winter': {
    occupation: [
      { label: { en: 'Sex Therapist', ru: 'Секс-терапевт' }, description: { en: 'Keeps tensions and intimacy issues from boiling over in close quarters', ru: 'Не даёт напряжению и проблемам с близостью взорваться в тесноте бункера' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента для взрослых' }, description: { en: 'Surprisingly skilled with cameras, lighting, and morale-boosting charisma', ru: 'Неожиданно умело управляется с камерой, светом и поднимает боевой дух харизмой' } },
    ],
    hobby: [
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск-танцы' }, description: { en: 'A welcome, electrifying distraction from the ash-grey monotony', ru: 'Желанная, искрящаяся отвлечёнка от серой пепельной монотонности' } },
      { label: { en: 'Nudist', ru: 'Нудист' }, description: { en: 'Surprisingly relaxed about the cramped bunker living arrangements', ru: 'На удивление спокойно относится к тесноте бункерного быта' } },
    ],
    fun_fact_1: [
      { label: { en: 'Secretly has an OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'Has been quietly uploading content since before the eruption', ru: 'Тихо выкладывал контент ещё до извержения' } },
      { label: { en: 'Slept with a minor celebrity once', ru: 'Однажды переспал(а) с не очень известной звездой' }, description: { en: 'Brings it up more often than anyone asked', ru: 'Вспоминает об этом чаще, чем кто-либо просил' } },
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка/нимфоман' }, description: { en: 'Struggles with the lack of privacy more than most', ru: 'Переносит недостаток уединения тяжелее остальных' } },
    ],
    fun_fact_2: [
      { label: { en: 'Had a steamy fling with a coworker before the eruption', ru: 'Перед извержением закрутил(а) интрижку с коллегой' }, description: { en: 'That coworker might be in this bunker', ru: 'Этот коллега может быть в этом бункере' } },
    ],
  },
  'zombie-apocalypse': {
    occupation: [
      { label: { en: 'Stripper', ru: 'Стриптизёр(-ша)' }, description: { en: 'Surprisingly strong core and great at reading a room\'s mood under pressure', ru: 'Удивительно сильный пресс и умение читать настроение группы под давлением' } },
      { label: { en: 'Adult Content Creator', ru: 'Создатель контента 18+' }, description: { en: 'Knows lighting, cameras, and how to keep morale up on camera — useful for the bunker\'s log recordings', ru: 'Разбирается в свете, камерах и умеет поддерживать боевой дух на записи — пригодится для видеодневников бункера' } },
    ],
    hobby: [
      { label: { en: 'Burlesque dancing', ru: 'Бурлеск' }, description: { en: 'Surprising stamina, flexibility, and a knack for keeping spirits high', ru: 'Удивительная выносливость, гибкость и умение поднимать настроение' } },
      { label: { en: 'Nudist', ru: 'Нудист(-ка)' }, description: { en: 'Completely unbothered by the bunker\'s limited laundry situation', ru: 'Совершенно не переживает из-за нехватки чистой одежды в бункере' } },
    ],
    fun_fact_1: [
      { label: { en: 'Secretly has an OnlyFans', ru: 'Тайно ведёт OnlyFans' }, description: { en: 'No signal down here, but the subscribers are waiting', ru: 'Сигнала тут нет, но подписчики ждут' } },
      { label: { en: 'Nymphomaniac', ru: 'Нимфоманка(-ман)' }, description: { en: 'Close quarters make this... noticeable', ru: 'Тесные условия делают это... заметным' } },
      { label: { en: 'Slept with a B-list celebrity once', ru: 'Однажды переспал(а) со знаменитостью второго эшелона' }, description: { en: 'Brings it up more often than necessary', ru: 'Упоминает это чаще, чем нужно' } },
    ],
    fun_fact_2: [
      { label: { en: 'Once exposed in a polyamorous relationship', ru: 'Когда-то состоял(а) в полиаморных отношениях' }, description: { en: 'Comfortable with unconventional group dynamics', ru: 'Спокойно относится к нестандартной групповой динамике' } },
    ],
  },
}
