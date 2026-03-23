import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Radio, Eye, ChevronRight } from 'lucide-react'
import { formatViewers } from '../utils/parseM3U.js'

export function NowPlaying({ channel }) {
  const [visible, setVisible] = useState(true)
  const [viewers, setViewers] = useState(channel?.viewers || 0)

  // Randomly fluctuate viewer count for realism
  useEffect(() => {
    if (!channel) return
    setViewers(channel.viewers)
    const interval = setInterval(() => {
      setViewers(v => {
        const delta = Math.floor(Math.random() * 200) - 100
        return Math.max(500, v + delta)
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [channel])

  // Auto-hide after 5s, show on hover
  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 5000)
    return () => clearTimeout(t)
  }, [channel])

  if (!channel) return null

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      style={{ pointerEvents: 'all' }}
    >
      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent h-48 bottom-0" 
           style={{ position: 'absolute', bottom: 0, height: '12rem' }} />

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="relative px-6 pb-20 pt-8"
          >
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                {/* Channel logo */}
                {channel.logo && (
                  <motion.div
                    layoutId="channel-logo"
                    className="w-14 h-14 rounded-xl overflow-hidden glass flex-shrink-0"
                  >
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-contain p-1"
                      onError={e => { e.target.style.display = 'none' }}
                    />
                  </motion.div>
                )}

                <div>
                  {/* Live badge */}
                  <div className="live-badge mb-1.5 w-fit">
                    <Radio className="w-2.5 h-2.5" />
                    <span>LIVE</span>
                  </div>

                  {/* Channel name */}
                  <h2 className="text-white text-2xl md:text-3xl font-display tracking-wide text-shadow-lg">
                    {channel.name}
                  </h2>

                  {/* Meta */}
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-white/50 text-xs font-mono">{channel.group}</span>
                    <span className="text-white/30">•</span>
                    <div className="flex items-center gap-1 text-white/50 text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{formatViewers(viewers)} watching</span>
                    </div>
                    {channel.country && (
                      <>
                        <span className="text-white/30">•</span>
                        <span className="text-white/50 text-xs">{channel.country}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Keyboard hint */}
              <div className="hidden md:flex items-center gap-2 text-white/30 text-xs">
                <kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-xs">←</kbd>
                <kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-xs">→</kbd>
                <span>switch channels</span>
                <ChevronRight className="w-3 h-3" />
                <kbd className="bg-white/10 border border-white/20 rounded px-1.5 py-0.5 font-mono text-xs">F</kbd>
                <span>fullscreen</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
