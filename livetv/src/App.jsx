import React, { useState, useEffect, useCallback, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'

import { Header } from './components/Header.jsx'
import { HeroSection } from './components/HeroSection.jsx'
import { StatsBar } from './components/StatsBar.jsx'
import { ChannelRow } from './components/Row.jsx'
import { LoadingScreen } from './components/LoadingScreen.jsx'
import { ToastNotification } from './components/ToastNotification.jsx'
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.jsx'

import { useChannels, useFirstChannel } from './hooks/useChannels.js'
import { useKeyboardNav } from './hooks/useKeyboard.js'
import { CATEGORIES } from './utils/parseM3U.js'

export default function App() {
  const { channels, loading, error, progress, refetch } = useChannels()
  const [currentChannel, setCurrentChannel] = useState(null)
  const [activeCategory, setActiveCategory] = useState('news')
  const [toastVisible, setToastVisible] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const toastTimer = useRef(null)

  // Set initial channel once loaded
  const firstChannel = useFirstChannel(channels)
  useEffect(() => {
    if (firstChannel && !currentChannel) {
      setCurrentChannel(firstChannel)
    }
  }, [firstChannel, currentChannel])

  // Channel switch handler
  const handleChannelSelect = useCallback((channel) => {
    if (!channel?.url) return
    setCurrentChannel(channel)

    // Show toast
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToastVisible(true)
    toastTimer.current = setTimeout(() => setToastVisible(false), 3000)

    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  // Keyboard navigation
  useKeyboardNav({
    channels,
    currentChannel,
    onChannelChange: handleChannelSelect,
    categoryId: activeCategory,
  })

  // Global keyboard: ? = shortcuts modal
  useEffect(() => {
    const handler = (e) => {
      if (e.key === '?' && e.target.tagName !== 'INPUT') {
        setShowShortcuts(p => !p)
      }
      if (e.key === 'Escape') setShowShortcuts(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // PWA install prompt
  const [installPrompt, setInstallPrompt] = useState(null)
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  return (
    <div className="min-h-screen bg-bg-primary text-white font-body overflow-x-hidden">
      {/* Loading screen */}
      <AnimatePresence>
        {loading && <LoadingScreen progress={progress} />}
      </AnimatePresence>

      {/* Main app */}
      {!loading && (
        <>
          <Header onRefresh={refetch} loading={loading} />

          {/* Hero player */}
          <HeroSection channel={currentChannel} />

          {/* Content below player */}
          <main className="relative z-10 bg-bg-primary">
            {/* Stats bar */}
            <StatsBar channels={channels} />

            {/* Error notice */}
            {error && (
              <div className="mx-6 md:mx-8 mb-4 flex items-center gap-2 
                              bg-orange-500/10 border border-orange-500/20 
                              rounded-xl px-4 py-3 text-orange-400 text-sm">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Category rows */}
            {channels && CATEGORIES.map((cat, i) => {
              const list = channels[cat.id] || []
              if (list.length === 0) return null
              return (
                <ChannelRow
                  key={cat.id}
                  category={cat}
                  channels={list}
                  activeChannel={currentChannel}
                  onChannelSelect={handleChannelSelect}
                  rowIndex={i}
                />
              )
            })}

            {/* Footer */}
            <footer className="mt-16 pb-8 px-8 border-t border-white/5 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg tracking-widest text-white/60">
                    LIVE<span className="text-red-500/60">STREAM</span>
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-white/20 text-xs text-center">
                    Streams sourced from{' '}
                    <a
                      href="https://iptv-org.github.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400/60 hover:text-red-400 transition-colors"
                    >
                      iptv-org
                    </a>
                    {' '}— public free-to-air channels only
                  </p>
                  <p className="text-white/10 text-xs">
                    Press <kbd className="font-mono bg-white/10 rounded px-1 text-white/20">?</kbd> for keyboard shortcuts
                  </p>
                </div>
                {installPrompt && (
                  <button
                    onClick={handleInstall}
                    className="glass border border-white/20 rounded-full px-4 py-2 
                               text-white/70 hover:text-white text-sm transition-all 
                               hover:bg-white/10 hover:border-white/30"
                  >
                    📱 Install App
                  </button>
                )}
              </div>
            </footer>
          </main>

          {/* Toast notification */}
          <ToastNotification channel={currentChannel} visible={toastVisible} />

          {/* Keyboard shortcuts modal */}
          <KeyboardShortcutsModal
            open={showShortcuts}
            onClose={() => setShowShortcuts(false)}
          />
        </>
      )}
    </div>
  )
}
