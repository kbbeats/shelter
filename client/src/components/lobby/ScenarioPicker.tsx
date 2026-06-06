import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'
import type { ScenarioPublic, ScenarioMode } from '@shelter/shared'

interface Props {
  selectedId: string | null
  isHost: boolean
  scenarioMode: ScenarioMode
  scenarioVotes: Record<string, string[]>
  hostName: string
  myPlayerName: string | null
}

export function ScenarioPicker({ selectedId, isHost, scenarioMode, scenarioVotes, hostName, myPlayerName }: Props) {
  const t = useT()
  const lang = useGameStore(s => s.language)
  const { scenarioList, getScenarios, selectScenario, setScenarioMode, castScenarioVote } = useGameStore()

  useEffect(() => {
    if (scenarioList.length === 0) getScenarios()
  }, [scenarioList.length, getScenarios])

  const myVote = myPlayerName
    ? (Object.entries(scenarioVotes).find(([, names]) => names.includes(myPlayerName))?.[0] ?? null)
    : null

  return (
    <div>
      <div className="section-label">{t('lobby.scenario')}</div>

      {isHost && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {(['host', 'vote', 'random'] as const).map(mode => (
            <button
              key={mode}
              className={`btn btn--sm${scenarioMode === mode ? ' btn--primary' : ' btn--ghost'}`}
              onClick={() => setScenarioMode(mode)}
            >
              {mode === 'host' ? "I'll Choose" : mode === 'vote' ? 'Group Vote' : 'Random'}
            </button>
          ))}
        </div>
      )}

      {!isHost && scenarioMode === 'host' && (
        <p className="dim mono" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Waiting for {hostName} to choose a scenario
        </p>
      )}

      {!isHost && scenarioMode === 'random' && !selectedId && (
        <p className="dim mono" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          Host is picking randomly...
        </p>
      )}

      {scenarioList.length === 0 ? (
        <p className="dim mono" style={{ fontSize: '0.8rem' }}>{t('lobby.scenario.select')}</p>
      ) : (
        <div className="scenario-picker">
          {scenarioList.map((s: ScenarioPublic) => {
            const isSelected = s.id === selectedId
            const isMyVote = scenarioMode === 'vote' && s.id === myVote
            const voteCount = scenarioVotes[s.id]?.length ?? 0
            const clickable =
              (scenarioMode === 'host' && isHost) ||
              scenarioMode === 'vote'

            const handleClick = () => {
              if (scenarioMode === 'host' && isHost) selectScenario(s.id)
              else if (scenarioMode === 'vote') castScenarioVote(s.id)
            }

            return (
              <div
                key={s.id}
                className={`scenario-card${isSelected || isMyVote ? ' scenario-card--selected' : ''}`}
                onClick={clickable ? handleClick : undefined}
                style={{
                  cursor: clickable ? 'pointer' : 'default',
                  borderColor: isSelected
                    ? s.theme.primaryColor
                    : isMyVote
                    ? s.theme.accentColor
                    : undefined,
                }}
              >
                <div className="scenario-card__icon">{s.theme.icon}</div>
                <div className="scenario-card__title">{s.title[lang]}</div>
                {s.isPremium && (
                  <span className="badge badge--host" style={{ marginTop: 4 }}>PRO</span>
                )}
                {scenarioMode === 'vote' && voteCount > 0 && (
                  <div style={{ fontSize: '0.75rem', marginTop: 4, opacity: 0.75 }}>
                    {voteCount} {voteCount === 1 ? 'vote' : 'votes'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
