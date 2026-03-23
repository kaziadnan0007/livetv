import { useEffect, useCallback } from 'react'

export function useKeyboardNav({ channels, currentChannel, onChannelChange, categoryId }) {
  const handleKeyDown = useCallback((e) => {
    if (!channels || !currentChannel) return

    // Don't intercept if typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

    const list = channels[categoryId] || channels.all || []
    const currentIdx = list.findIndex(ch => ch.id === currentChannel.id)

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown': {
        e.preventDefault()
        const nextIdx = (currentIdx + 1) % list.length
        if (list[nextIdx]) onChannelChange(list[nextIdx])
        break
      }
      case 'ArrowLeft':
      case 'ArrowUp': {
        e.preventDefault()
        const prevIdx = (currentIdx - 1 + list.length) % list.length
        if (list[prevIdx]) onChannelChange(list[prevIdx])
        break
      }
      case 'Space': {
        // Toggle play/pause handled by video.js
        break
      }
      case 'f':
      case 'F': {
        // Fullscreen
        const player = document.querySelector('.video-js')
        if (player) {
          if (document.fullscreenElement) {
            document.exitFullscreen()
          } else {
            player.requestFullscreen?.()
          }
        }
        break
      }
      case 'm':
      case 'M': {
        // Mute toggle
        const video = document.querySelector('video')
        if (video) video.muted = !video.muted
        break
      }
      default:
        break
    }
  }, [channels, currentChannel, onChannelChange, categoryId])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}
