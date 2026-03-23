import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Keyboard } from 'lucide-react'

const shortcuts = [
  { keys: ['←', '→'], action: 'Previous / Next channel' },
  { keys: ['↑', '↓'], action: 'Previous / Next channel' },
  { keys: ['F'], action: 'Toggle fullscreen' },
  { keys: ['M'], action: 'Toggle mute' },
  { keys: ['Space'], action: 'Play / Pause' },
  { keys: ['?'], action: 'Show this help' },
]

export function KeyboardShortcutsModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="relative glass border border-white/20 rounded-2xl p-6 w-full max-w-sm shadow-glass"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-red-400" />
                <h3 className="text-white font-semibold font-body">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 
                           flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/60" />
              </button>
            </div>

            {/* Shortcuts list */}
            <div className="space-y-3">
              {shortcuts.map(({ keys, action }) => (
                <div key={action} className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{action}</span>
                  <div className="flex items-center gap-1">
                    {keys.map(k => (
                      <kbd
                        key={k}
                        className="bg-white/10 border border-white/20 rounded px-2 py-0.5
                                   font-mono text-xs text-white min-w-[1.75rem] text-center"
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-white/20 text-xs mt-5 text-center">
              Press <kbd className="bg-white/10 border border-white/20 rounded px-1 font-mono text-[10px]">?</kbd> anytime to toggle
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
