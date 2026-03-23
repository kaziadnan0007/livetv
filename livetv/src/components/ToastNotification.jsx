import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tv, Check } from 'lucide-react'

export function ToastNotification({ channel, visible }) {
  if (!channel) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={channel.id}
          initial={{ opacity: 0, x: 60, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[60] flex items-center gap-3
                     glass rounded-xl border border-white/20 px-4 py-3 shadow-glass
                     max-w-xs"
        >
          {/* Channel logo or icon */}
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
            {channel.logo ? (
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-contain p-1"
                onError={e => { e.target.style.display = 'none' }}
              />
            ) : (
              <Tv className="w-5 h-5 text-red-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Check className="w-3 h-3 text-green-400 flex-shrink-0" />
              <span className="text-white/60 text-xs">Now watching</span>
            </div>
            <p className="text-white text-sm font-semibold truncate">{channel.name}</p>
            <p className="text-white/40 text-xs truncate">{channel.group}</p>
          </div>

          {/* Live dot */}
          <div className="flex-shrink-0">
            <div className="live-badge">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
