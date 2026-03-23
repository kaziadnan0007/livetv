import React from 'react'
import { motion } from 'framer-motion'
import { Tv } from 'lucide-react'

export function LoadingScreen({ progress }) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-bg-primary"
    >
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(229,9,20,0.08) 0%, transparent 70%)' }} />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative"
        >
          <div className="w-20 h-20 rounded-2xl bg-red-600/10 border border-red-500/30
                          flex items-center justify-center backdrop-blur-sm">
            <Tv className="w-9 h-9 text-red-500" />
          </div>
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 rounded-2xl border border-red-500/40"
            animate={{ scale: [1, 1.3, 1.3], opacity: [1, 0, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-5xl tracking-widest text-white">
            LIVE<span className="text-red-500">STREAM</span>
          </h1>
          <p className="text-white/40 text-sm font-body mt-2 tracking-widest uppercase">
            Fetching live channels…
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-orange-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <p className="text-white/30 text-xs font-mono">{progress}% — parsing M3U playlist</p>

        {/* Scanning animation */}
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="w-1 rounded-full bg-red-500"
              animate={{ height: ['8px', '24px', '8px'] }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
