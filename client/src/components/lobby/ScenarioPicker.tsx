import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'
import type { ScenarioPublic } from '@shelter/shared'

interface Props {
  selectedId: string | null
  isHost: boolean
}

export function ScenarioPicker({ selectedId, isHost }: Props) {
  const t = useT()
  const lang = useGameStore(s => s.language)
  const { scenarioList, getScenarios, selectScenario } = useGameStore()

  useEffect(() => {
    if (scenarioList.length === 0) getScenarios()
  }, [scenarioList.length, getScenarios])

  return (
    <div>
      <div className="section-label">{t('lobby.scenario')}</div>
      {scenarioList.length === 0 ? (
        <p className="dim mono" style={{ fontSize: '0.8rem' }}>{t('lobby.scenario.select')}</p>
      ) : (
        <div className="scenario-picker">
          {scenarioList.map((s: ScenarioPublic) => (
            <div
              key={s.id}
              className={`scenario-card${s.id === selectedId ? ' scenario-card--selected' : ''}`}
              onClick={() => isHost && selectScenario(s.id)}
              style={{ cursor: isHost ? 'pointer' : 'default', borderColor: s.id === selectedId ? s.theme.primaryColor : undefined }}
            >
              <div className="scenario-card__icon">{s.theme.icon}</div>
              <div className="scenario-card__title">{s.title[lang]}</div>
              {s.isPremium && (
                <span className="badge badge--host" style={{ marginTop: 4 }}>PRO</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
