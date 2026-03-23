import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tv, Search, Bell, Settings, Wifi, RefreshCw } from 'lucide-react'

export function Header({ onRefresh, loading }) {
  const [scrolled, setScrolled] = useState(false)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-8 h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Tv className="w-6 h-6 text-red-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span className="font-display text-xl tracking-widest text-white">
            LIVE<span className="text-red-500">STREAM</span>
          </span>
        </div>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-6">
          {['Home', 'Sports', 'News', 'Movies', 'Entertainment'].map((item) => (
            <button
              key={item}
              className="text-white/60 hover:text-white text-sm font-body 
                         transition-colors duration-200 hover:text-red-400"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Live time */}
          <div className="hidden md:flex items-center gap-1.5 glass rounded-full px-3 py-1">
            <Wifi className="w-3 h-3 text-green-400" />
            <span className="text-white/60 text-xs font-mono">{timeStr}</span>
          </div>

          {/* Refresh */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={onRefresh}
            disabled={loading}
            className="w-8 h-8 rounded-full glass hover:bg-white/15 flex items-center 
                       justify-center text-white/60 hover:text-white transition-all"
            title="Refresh channels"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-full glass hover:bg-white/15 flex items-center 
                       justify-center text-white/60 hover:text-white transition-all"
          >
            <Search className="w-3.5 h-3.5" />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-600 
                       flex items-center justify-center cursor-pointer ring-2 ring-white/10"
          >
            <span className="text-white text-xs font-bold">L</span>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
