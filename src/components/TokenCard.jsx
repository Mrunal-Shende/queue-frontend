import { formatToken, formatWait, statusColor } from '../utils/helpers'

/**
 * TokenCard — displayed on LiveQueue and History screens
 *
 * Props:
 *  tokenLabel        string   e.g. "A-023"
 *  queueType         string   "normal" | "priority"
 *  venueName         string
 *  status            string   "waiting" | "serving" | "completed" | "cancelled"
 *  tokensAhead       number
 *  estimatedWait     number   minutes
 *  currentToken      number   currently being served
 *  compact           bool     smaller version for history list
 */
export default function TokenCard({
  tokenLabel,
  queueType,
  venueName,
  status = 'waiting',
  tokensAhead,
  estimatedWait,
  currentToken,
  compact = false,
}) {
  const colorClass = statusColor(status)

  if (compact) {
    return (
      <div className="card flex items-center gap-4 animate-fade-in">
        <div className="token-display text-2xl font-bold text-brand-400 w-16 shrink-0">
          {tokenLabel}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-100 truncate">{venueName}</p>
          <p className="text-sm text-slate-500">{queueType === 'priority' ? '⭐ Priority' : 'Normal'} queue</p>
        </div>
        <span className={`badge ${colorClass} capitalize shrink-0`}>
          {status}
        </span>
      </div>
    )
  }

  return (
    <div className="card animate-bounce-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Your Token</p>
          <div className="token-display text-5xl font-bold text-brand-400 leading-none">
            {tokenLabel}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`badge ${colorClass} capitalize`}>{status}</span>
          {queueType === 'priority' && (
            <span className="badge text-amber-400 bg-amber-400/10">⭐ Priority</span>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4">
        <p className="text-slate-400 text-sm mb-3 font-medium">{venueName}</p>

        <div className="grid grid-cols-3 gap-3">
          {/* Now Serving */}
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Serving</p>
            <p className="token-display text-lg font-bold text-slate-200">
              {currentToken != null ? formatToken(currentToken) : '—'}
            </p>
          </div>

          {/* Tokens Ahead */}
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Ahead</p>
            <p className="token-display text-lg font-bold text-slate-200">
              {tokensAhead != null ? tokensAhead : '—'}
            </p>
          </div>

          {/* Est. Wait */}
          <div className="bg-slate-800/60 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Est. Wait</p>
            <p className="token-display text-lg font-bold text-slate-200">
              {formatWait(estimatedWait)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
