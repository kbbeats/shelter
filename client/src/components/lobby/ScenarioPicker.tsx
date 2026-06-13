import { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'
import { useT } from '../../i18n'
import { ScenarioIcon } from '../icons/ScenarioIcons'
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
    <div className="lb-ticket">
      <div className="lb-ticket__head">
        <span className="lb-ticket__title">{t('lobby.scenario')}</span>
      </div>

      {isHost && (
        <div className="lb-modes">
          {(['host', 'vote', 'random'] as const).map(mode => (
            <button
              key={mode}
              className={`z-btn z-btn--sm${scenarioMode === mode ? ' z-btn--primary' : ' z-btn--outline'}`}
              onClick={() => setScenarioMode(mode)}
            >
              {t(`lobby.scenario.mode.${mode}`)}
            </button>
          ))}
        </div>
      )}

      {!isHost && scenarioMode === 'host' && (
        <p className="lb-ticket__body dim mono" style={{ fontSize: '0.85rem', paddingBottom: 0 }}>
          {t('lobby.scenario.waiting_host').replace('{host}', hostName)}
        </p>
      )}

      {!isHost && scenarioMode === 'random' && !selectedId && (
        <p className="lb-ticket__body dim mono" style={{ fontSize: '0.85rem', paddingBottom: 0 }}>
          {t('lobby.scenario.waiting_random')}
        </p>
      )}

      {scenarioList.length === 0 ? (
        <p className="lb-ticket__body dim mono" style={{ fontSize: '0.8rem' }}>{t('lobby.scenario.select')}</p>
      ) : (
        <div className={`lb-scenarios${scenarioMode === 'random' ? ' lb-scenarios--locked' : ''}`}>
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

            const stateClass = isSelected
              ? ' lb-scenario--selected'
              : isMyVote
              ? ' lb-scenario--voted'
              : ''

            return (
              <div
                key={s.id}
                className={`lb-scenario${stateClass}`}
                onClick={clickable ? handleClick : undefined}
                style={{ cursor: clickable ? 'pointer' : 'default' }}
              >
                <span className="lb-scenario__icon">
                  <ScenarioIcon id={s.id} />
                </span>
                <span className="lb-scenario__title">{s.title[lang]}</span>
                {s.isPremium && (
                  <span className="lb-tag lb-tag--host">PRO</span>
                )}
                {scenarioMode === 'vote' && voteCount > 0 && (
                  <span className="lb-scenario__votes">
                    {voteCount} {voteCount === 1 ? t('lobby.scenario.vote') : t('lobby.scenario.votes')}
                  </span>
                )}
                {scenarioMode === 'random' && (
                  <span className="lb-scenario__lock-badge" aria-hidden="true">🎲</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
