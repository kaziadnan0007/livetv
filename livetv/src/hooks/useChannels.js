import { useState, useEffect, useCallback } from 'react'
import { parseM3U, categorizeChannels, FALLBACK_CHANNELS } from '../utils/parseM3U.js'

const M3U_SOURCES = [
  // Via Vercel proxy (avoids CORS in production)
  '/iptv-proxy/iptv/index.m3u',
  // Direct (works locally with vite proxy)
  'https://iptv-org.github.io/iptv/index.m3u',
  // Specific category lists
  '/iptv-proxy/iptv/categories/news.m3u',
]

const CACHE_KEY = 'livetv_channels_v3'
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

function getCached() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function setCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch {}
}

export function useChannels() {
  const [channels, setChannels] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const fetchChannels = useCallback(async () => {
    // Check cache first
    const cached = getCached()
    if (cached) {
      setChannels(cached)
      setLoading(false)
      return
    }

    setLoading(true)
    setProgress(10)

    let parsed = []

    // Try fetching the index M3U
    for (const src of M3U_SOURCES) {
      try {
        const res = await fetch(src, {
          headers: { 'Accept': 'text/plain, */*' },
          signal: AbortSignal.timeout(15000),
        })
        if (!res.ok) continue

        setProgress(40)
        const text = await res.text()
        setProgress(65)

        if (text.includes('#EXTINF') || text.includes('#EXTM3U')) {
          parsed = parseM3U(text)
          setProgress(80)
          if (parsed.length > 0) break
        }
      } catch (e) {
        console.warn(`Failed to fetch ${src}:`, e.message)
      }
    }

    setProgress(90)

    let categorized
    if (parsed.length > 0) {
      categorized = categorizeChannels(parsed)
      // Ensure minimum channels per category
      Object.keys(categorized).forEach(key => {
        if (categorized[key].length === 0 && FALLBACK_CHANNELS[key]) {
          categorized[key] = FALLBACK_CHANNELS[key]
        }
      })
    } else {
      console.warn('Using fallback channels')
      categorized = FALLBACK_CHANNELS
      setError('Using cached channel list — live refresh failed')
    }

    setCache(categorized)
    setChannels(categorized)
    setProgress(100)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchChannels()
  }, [fetchChannels])

  return { channels, loading, error, progress, refetch: fetchChannels }
}

export function useFirstChannel(channels) {
  if (!channels) return null
  // Return first available channel with a URL
  for (const key of ['all', 'news', 'sports', 'entertainment', 'movies']) {
    const list = channels[key]
    if (list && list.length > 0 && list[0].url) return list[0]
  }
  return null
}
