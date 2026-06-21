import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getVenues, getQueues, nextToken } from '../api'
import { useSocket } from '../hooks/useSocket'
import { formatToken } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'

export default function StaffPanel() {
  const navigate  = useNavigate()
  const { logout } = useAuth()

  const [venues, setVenues]               = useState([])
  const [selectedVenue, setSelectedVenue] = useState(null)
  const [queues, setQueues]               = useState([])
  const [selectedQueue, setSelectedQueue] = useState(null)
  const [currentToken, setCurrentToken]   = useState(null)
  const [queueLength, setQueueLength]     = useState(0)
  const [calling, setCalling]             = useState(false)
  const [error, setError]                 = useState('')
  const [successMsg, setSuccessMsg]       = useState('')
  const [loadingVenues, setLoadingVenues] = useState(true)
  const [loadingQueues, setLoadingQueues] = useState(false)

  // Load venues on mount
  useEffect(() => {
    getVenues()
      .then((res) => setVenues(res.data))
      .catch(() => setError('Failed to load venues.'))
      .finally(() => setLoadingVenues(false))
  }, [])

  // Load queues when venue selected
  useEffect(() => {
    if (!selectedVenue) return
    setLoadingQueues(true)
    setSelectedQueue(null)
    getQueues(selectedVenue._id || selectedVenue.id)
      .then((res) => {
        setQueues(res.data)
        // Auto-select first queue
        if (res.data.length > 0) {
          setSelectedQueue(res.data[0])
          setCurrentToken(res.data[0].current_token)
          setQueueLength(res.data[0].current_length || 0)
        }
      })
      .catch(() => setError('Failed to load queues.'))
      .finally(() => setLoadingQueues(false))
  }, [selectedVenue])

  // Live socket updates
  const handleQueueUpdate = useCallback((data) => {
    setCurrentToken(data.current_token)
    if (data.queue_length != null) setQueueLength(data.queue_length)
  }, [])

  useSocket(
    selectedQueue?._id || selectedQueue?.id,
    handleQueueUpdate,
    () => {}
  )

  // Call next token
  const handleNext = async () => {
    if (!selectedQueue) return
    setCalling(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await nextToken(selectedQueue._id || selectedQueue.id)
      setCurrentToken(res.data.current_token)
      setQueueLength(res.data.remaining ?? queueLength - 1)
      setSuccessMsg(`Called token ${formatToken(res.data.current_token)}`)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to advance queue.')
    } finally {
      setCalling(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">SmartQueue</p>
            <p className="text-brand-400 text-xs">Staff Panel</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-slate-500 hover:text-red-400 text-xs font-medium transition-colors"
        >
          Sign out
        </button>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-5">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* Step 1: Select Venue */}
        <div className="card">
          <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">1. Select Venue</h2>
          {loadingVenues ? (
            <div className="animate-pulse h-10 bg-slate-800 rounded-xl" />
          ) : (
            <select
              value={selectedVenue ? (selectedVenue._id || selectedVenue.id) : ''}
              onChange={(e) => {
                const v = venues.find((x) => (x._id || x.id) === e.target.value)
                setSelectedVenue(v || null)
              }}
              className="input"
            >
              <option value="">— Choose a venue —</option>
              {venues.map((v) => (
                <option key={v._id || v.id} value={v._id || v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Step 2: Select Queue */}
        {selectedVenue && (
          <div className="card animate-slide-up">
            <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wider mb-3">2. Select Queue</h2>
            {loadingQueues ? (
              <div className="animate-pulse h-10 bg-slate-800 rounded-xl" />
            ) : (
              <div className="flex gap-2">
                {queues.map((q) => (
                  <button
                    key={q._id || q.id}
                    onClick={() => {
                      setSelectedQueue(q)
                      setCurrentToken(q.current_token)
                      setQueueLength(q.current_length || 0)
                    }}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold capitalize transition-all ${
                      (selectedQueue?._id || selectedQueue?.id) === (q._id || q.id)
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {q.type === 'priority' ? '⭐ ' : ''}{q.type}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Queue Control */}
        {selectedQueue && (
          <div className="card animate-slide-up">
            <h2 className="font-semibold text-slate-300 text-sm uppercase tracking-wider mb-4">3. Queue Control</h2>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-slate-800/60 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Now Serving</p>
                <p className="token-display text-4xl font-bold text-brand-400">
                  {currentToken != null ? formatToken(currentToken) : '—'}
                </p>
              </div>
              <div className="bg-slate-800/60 rounded-2xl p-5 text-center">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">In Queue</p>
                <p className="token-display text-4xl font-bold text-slate-200">
                  {queueLength}
                </p>
              </div>
            </div>

            {/* Live indicator */}
            <div className="flex items-center gap-2 mb-4 justify-center">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
              <span className="text-xs text-green-400 font-medium">Live — customers see updates instantly</span>
            </div>

            {/* Next Token button */}
            <button
              onClick={handleNext}
              disabled={calling || queueLength === 0}
              className="w-full bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-5 rounded-2xl transition-all duration-200 shadow-lg shadow-green-900/30"
            >
              {calling ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calling next...
                </span>
              ) : queueLength === 0 ? (
                '— Queue Empty —'
              ) : (
                '📢 Call Next Token'
              )}
            </button>

            {queueLength === 0 && (
              <p className="text-center text-slate-500 text-xs mt-3">
                No more tokens in this queue.
              </p>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="card border-slate-800/50 bg-slate-900/50">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">How it works</h3>
          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex gap-2"><span className="text-brand-400">1.</span> Select your venue and queue type above.</li>
            <li className="flex gap-2"><span className="text-brand-400">2.</span> Click "Call Next Token" to serve the next customer.</li>
            <li className="flex gap-2"><span className="text-brand-400">3.</span> All customers waiting in this queue see the update instantly.</li>
            <li className="flex gap-2"><span className="text-brand-400">4.</span> Customers 3 tokens away receive an automatic alert.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
