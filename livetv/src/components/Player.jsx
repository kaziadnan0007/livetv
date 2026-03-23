import React, { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, Loader2, Volume2, VolumeX, Maximize2 } from 'lucide-react'

let videojs = null
let vjsLoaded = false
let vjsListeners = []

async function loadVideoJS() {
  if (vjsLoaded) return videojs
  try {
    const vjs = await import('video.js')
    videojs = vjs.default
    // Load HLS support
    await import('@videojs/http-streaming')
    vjsLoaded = true
    vjsListeners.forEach(fn => fn(videojs))
    vjsListeners = []
    return videojs
  } catch (e) {
    console.error('VideoJS load error:', e)
    return null
  }
}

// Preload immediately
loadVideoJS()

export function Player({ channel, onError }) {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | playing | error | buffering
  const [muted, setMuted] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const initPlayer = useCallback(async (vjs) => {
    if (!containerRef.current || playerRef.current) return

    // Create video element
    const videoEl = document.createElement('video')
    videoEl.className = 'video-js vjs-theme-live vjs-big-play-centered'
    videoEl.setAttribute('playsinline', '')
    videoEl.setAttribute('webkit-playsinline', '')
    containerRef.current.appendChild(videoEl)

    const player = vjs(videoEl, {
      controls: true,
      autoplay: true,
      muted: true,
      preload: 'auto',
      fluid: false,
      responsive: false,
      liveui: true,
      html5: {
        vhs: {
          overrideNative: true,
          fastQualityChange: true,
          enableLowInitialPlaylist: true,
          limitRenditionByPlayerDimensions: false,
          useNetworkInformationApi: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
    })

    playerRef.current = player

    player.on('waiting', () => setStatus('buffering'))
    player.on('playing', () => setStatus('playing'))
    player.on('error', () => {
      setStatus('error')
      onError?.(player.error())
    })
    player.on('loadstart', () => setStatus('loading'))

    return player
  }, [onError])

  const loadSource = useCallback((player, ch) => {
    if (!player || !ch?.url) return
    try {
      player.src({ src: ch.url, type: 'application/x-mpegURL' })
      player.load()
      player.play().catch(() => {})
      setStatus('loading')
    } catch (e) {
      setStatus('error')
    }
  }, [])

  // Mount player once
  useEffect(() => {
    let player = null

    const setup = async () => {
      const vjs = await loadVideoJS()
      if (!vjs || !containerRef.current) return

      player = await initPlayer(vjs)
      if (player && channel) {
        loadSource(player, channel)
      }
      setIsMounted(true)
    }

    setup()

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.dispose()
        } catch {}
        playerRef.current = null
      }
    }
  }, []) // Only on mount

  // Swap source when channel changes (no re-mount)
  useEffect(() => {
    if (playerRef.current && channel && isMounted) {
      loadSource(playerRef.current, channel)
    }
  }, [channel, isMounted, loadSource])

  const toggleMute = () => {
    if (!playerRef.current) return
    const newMuted = !playerRef.current.muted()
    playerRef.current.muted(newMuted)
    setMuted(newMuted)
  }

  const toggleFullscreen = () => {
    if (!playerRef.current) return
    if (playerRef.current.isFullscreen()) {
      playerRef.current.exitFullscreen()
    } else {
      playerRef.current.requestFullscreen()
    }
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Video.js mount point */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />

      {/* Status overlays */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
              <span className="text-white/70 text-sm font-body">Connecting to stream…</span>
            </div>
          </motion.div>
        )}

        {status === 'buffering' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 
                       backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-none"
          >
            <Loader2 className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
            <span className="text-white/80 text-xs">Buffering</span>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <WifiOff className="w-12 h-12 text-red-500" />
              <div>
                <p className="text-white font-semibold text-lg">Stream Unavailable</p>
                <p className="text-white/50 text-sm mt-1">Try another channel</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom quick controls */}
      <div className="absolute bottom-16 right-4 flex items-center gap-2 opacity-0 
                      hover:opacity-100 transition-opacity duration-300 group z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="glass rounded-full p-2 hover:bg-white/20 transition-all"
          title={muted ? 'Unmute (M)' : 'Mute (M)'}
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-white" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleFullscreen}
          className="glass rounded-full p-2 hover:bg-white/20 transition-all"
          title="Fullscreen (F)"
        >
          <Maximize2 className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Signal indicator */}
      <motion.div
        className="absolute top-4 left-4 flex items-center gap-1.5 pointer-events-none"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {status === 'playing' && (
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-green-400 text-xs font-mono">LIVE</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}
