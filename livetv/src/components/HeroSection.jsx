import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player } from './Player.jsx'
import { NowPlaying } from './NowPlaying.jsx'
import { ChevronDown, AlertTriangle } from 'lucide-react'

export function HeroSection({ channel, onError }) {
  const [streamError, setStreamError] = useState(false)

  const handleError = (err) => {
    setStreamError(true)
    onError?.(err)
  }

  // Reset error when channel changes
  React.useEffect(() => {
    setStreamError(false)
  }, [channel?.id])

  return (
    <section className="relative w-full" style={{ height: '80vh', minHeight: 400, maxHeight: 900 }}>
      {/* Player */}
      <div className="absolute inset-0">
        <Player channel={channel} onError={handleError} />
      </div>

      {/* Now Playing overlay */}
      <NowPlaying channel={channel} />

      {/* Top gradient for header readability */}
      <div className="absolute top-0 left-0 right-0 h-32
                      bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* Stream error banner */}
      <AnimatePresence>
        {streamError && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30
                       flex items-center gap-2 bg-orange-500/90 backdrop-blur-sm
                       rounded-full px-4 py-2 text-white text-sm shadow-lg"
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Stream failed — click another channel below</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center
                   gap-1 text-white/30 pointer-events-none"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="text-xs font-body tracking-widest uppercase">Channels</span>
        <ChevronDown className="w-4 h-4" />
      </motion.div>

      {/* Decorative scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 4px)',
        }}
      />
    </section>
  )
}
