import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

/**
 * Connects to the Socket.io server and joins a queue room.
 * Automatically cleans up on unmount.
 *
 * @param {string|null} queue_id     - The queue to join
 * @param {Function}    onQueueUpdate - Called with { current_token } on 'queue_updated'
 * @param {Function}    onTurnSoon    - Called on 'your_turn_soon'
 */
export const useSocket = (queue_id, onQueueUpdate, onTurnSoon) => {
  const socketRef = useRef(null)

  useEffect(() => {
    if (!queue_id) return

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      socket.emit('join_queue_room', { queue_id })
    })

    socket.on('queue_updated', (data) => {
      console.log('[Socket] queue_updated:', data)
      onQueueUpdate(data)
    })

    socket.on('your_turn_soon', () => {
      console.log('[Socket] your_turn_soon')
      onTurnSoon()
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
    })

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message)
    })

    return () => {
      socket.emit('leave_queue_room', { queue_id })
      socket.disconnect()
      console.log('[Socket] Cleaned up')
    }
  }, [queue_id])

  return socketRef.current
}
