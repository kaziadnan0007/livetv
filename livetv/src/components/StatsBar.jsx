import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, Zap, TrendingUp } from 'lucide-react'
import { formatViewers } from '../utils/parseM3U.js'

export function StatsBar({ channels }) {
  const [totalViewers, setTotalViewers] = useState(0)
  const [totalChannels, setTotalChannels] = useState(0)

  useEffect(() => {
    if (!channels) return
    let total = 0
    let count = 0
    Object.values(channels).forEach(list => {
      list.forEach(ch => {
        total += (ch.viewers || 0)
        count++
      })
    })
    setTotalViewers(total)
    setTotalChannels(count)
  }, [channels])

  // Animate total viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalViewers(v => v + Math.floor(Math.random() * 500) - 200)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const stats = [
    { icon: Users, label: 'Live Viewers', value: formatViewers(totalViewers), color: 'text-red-400' },
    { icon: Globe, label: 'Channels', value: totalChannels.toString(), color: 'text-blue-400' },
    { icon: Zap, label: 'Stream Quality', value: 'HD/4K', color: 'text-yellow-400' },
    { icon: TrendingUp, label: 'Uptime', value: '99.9%', color: 'text-green-400' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative mx-4 md:mx-8 -mt-6 z-20 mb-8"
    >
      <div className="glass rounded-2xl border border-white/10 px-6 py-4
                      shadow-glass grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg leading-none font-mono">{value}</p>
              <p className="text-white/40 text-xs mt-0.5 font-body">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
