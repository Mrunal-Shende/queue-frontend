/**
 * Format a token number into a label like "A-023"
 * @param {number} num
 * @returns {string}
 */
export const formatToken = (num) =>
  `A-${String(num).padStart(3, '0')}`

/**
 * Format minutes into a human-readable wait string
 * @param {number} minutes
 * @returns {string}
 */
export const formatWait = (minutes) => {
  if (!minutes && minutes !== 0) return '—'
  if (minutes === 0) return 'Now!'
  if (minutes < 60) return `~${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`
}

/**
 * Return a Tailwind color class based on queue status
 * @param {string} status
 * @returns {string}
 */
export const statusColor = (status) => {
  const map = {
    waiting:   'text-yellow-400 bg-yellow-400/10',
    serving:   'text-green-400 bg-green-400/10',
    completed: 'text-slate-400 bg-slate-400/10',
    cancelled: 'text-red-400 bg-red-400/10',
    skipped:   'text-orange-400 bg-orange-400/10',
  }
  return map[status] || 'text-slate-400 bg-slate-400/10'
}

/**
 * Format a date string into a readable format
 * @param {string} dateStr
 * @returns {string}
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
