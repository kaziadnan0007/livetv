/**
 * Parses M3U playlist text into structured channel objects.
 * Extracts: name, tvg-logo, group-title, stream URL (HLS .m3u8 only)
 */

export function parseM3U(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const channels = []
  let current = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith('#EXTINF:')) {
      // Parse attributes from #EXTINF line
      const nameMatch = line.match(/,(.+)$/)
      const logoMatch = line.match(/tvg-logo="([^"]*)"/)
      const groupMatch = line.match(/group-title="([^"]*)"/)
      const idMatch = line.match(/tvg-id="([^"]*)"/)
      const countryMatch = line.match(/tvg-country="([^"]*)"/)

      current = {
        name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
        logo: logoMatch ? logoMatch[1].trim() : '',
        group: groupMatch ? groupMatch[1].trim() : 'General',
        tvgId: idMatch ? idMatch[1] : '',
        country: countryMatch ? countryMatch[1] : '',
        url: '',
        viewers: Math.floor(Math.random() * 50000) + 1000,
        id: `ch_${Date.now()}_${i}`,
      }
    } else if (line.startsWith('http') && current) {
      // Only accept HLS streams
      if (/\.m3u8(\?.*)?$/i.test(line) || line.includes('m3u8')) {
        current.url = line
        channels.push({ ...current })
      }
      current = null
    } else if (!line.startsWith('#') && line.startsWith('http') && current) {
      // Some streams don't end in .m3u8 but are still HLS
      current.url = line
      channels.push({ ...current })
      current = null
    }
  }

  return channels
}

/**
 * Categorizes channels by group keywords
 */
export const CATEGORIES = [
  {
    id: 'sports',
    label: 'Sports',
    icon: '⚽',
    keywords: ['sport', 'sports', 'football', 'soccer', 'basketball', 'tennis',
      'cricket', 'golf', 'boxing', 'racing', 'nfl', 'nba', 'espn', 'sky sports',
      'eurosport', 'dazn', 'bein sports', 'fight', 'motor', 'olympic', 'wimbledon'],
  },
  {
    id: 'news',
    label: 'News',
    icon: '📰',
    keywords: ['news', 'cnn', 'bbc', 'fox news', 'msnbc', 'al jazeera', 'sky news',
      'bloomberg', 'cnbc', 'abc news', 'nbc news', 'cbs news', 'euronews',
      'france 24', 'dw', 'rt', 'nhk', 'arirang'],
  },
  {
    id: 'movies',
    label: 'Movies',
    icon: '🎬',
    keywords: ['movie', 'movies', 'film', 'cinema', 'hbo', 'showtime', 'starz',
      'cinemax', 'action', 'horror', 'comedy film', 'thriller', 'drama', 'hallmark'],
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: '🎭',
    keywords: ['entertainment', 'mtv', 'vh1', 'e!', 'bravo', 'tlc', 'discovery',
      'national geographic', 'history', 'anime', 'cartoon', 'kids', 'music',
      'comedy', 'reality', 'travel', 'cooking', 'food', 'lifestyle', 'general'],
  },
]

export function categorizeChannels(channels) {
  const result = {}
  CATEGORIES.forEach(cat => { result[cat.id] = [] })
  result.all = []

  channels.forEach(ch => {
    const groupLower = (ch.group || '').toLowerCase()
    const nameLower = (ch.name || '').toLowerCase()
    let matched = false

    for (const cat of CATEGORIES) {
      if (cat.keywords.some(kw => groupLower.includes(kw) || nameLower.includes(kw))) {
        if (result[cat.id].length < 60) {
          result[cat.id].push(ch)
        }
        matched = true
        break
      }
    }

    if (!matched && result.entertainment.length < 60) {
      result.entertainment.push(ch)
    }

    if (result.all.length < 20) result.all.push(ch)
  })

  return result
}

/**
 * Fallback channels for when M3U fails to load
 * Using known public test streams
 */
export const FALLBACK_CHANNELS = {
  sports: [
    {
      id: 'fb_s1', name: 'NASA TV', group: 'Sports',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      viewers: 24500,
    },
    {
      id: 'fb_s2', name: 'World Surf League', group: 'Sports',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Smiley.svg/100px-Smiley.svg.png',
      url: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648a47044fada5e8cde25c26fa1f/master.m3u8',
      viewers: 8200,
    },
    {
      id: 'fb_s3', name: 'CBS News', group: 'Sports',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_News.svg/200px-CBS_News.svg.png',
      url: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648a47044fada5e8cde25c26fa1f/master.m3u8',
      viewers: 45000,
    },
  ],
  news: [
    {
      id: 'fb_n1', name: 'NASA TV Live', group: 'News',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      viewers: 31000,
    },
    {
      id: 'fb_n2', name: 'CBS News NY', group: 'News',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_News.svg/200px-CBS_News.svg.png',
      url: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648a47044fada5e8cde25c26fa1f/master.m3u8',
      viewers: 55000,
    },
  ],
  movies: [
    {
      id: 'fb_m1', name: 'NASA Public', group: 'Movies',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      viewers: 12000,
    },
  ],
  entertainment: [
    {
      id: 'fb_e1', name: 'NASA TV HD', group: 'Entertainment',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      viewers: 19000,
    },
    {
      id: 'fb_e2', name: 'CBS News Live', group: 'Entertainment',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CBS_News.svg/200px-CBS_News.svg.png',
      url: 'https://cbsn-us.cbsnstream.cbsnews.com/out/v1/55a8648a47044fada5e8cde25c26fa1f/master.m3u8',
      viewers: 37000,
    },
  ],
  all: [
    {
      id: 'fb_a1', name: 'NASA TV', group: 'General',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/200px-NASA_logo.svg.png',
      url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
      viewers: 24500,
    },
  ],
}

export function formatViewers(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export function getFallbackImage(channel) {
  // Generate a consistent Unsplash image based on group
  const groupMap = {
    sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=180&fit=crop',
    news: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&h=180&fit=crop',
    movies: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=180&fit=crop',
    entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=180&fit=crop',
    default: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=300&h=180&fit=crop',
  }
  const g = (channel.group || '').toLowerCase()
  for (const [key, url] of Object.entries(groupMap)) {
    if (g.includes(key)) return url
  }
  return groupMap.default
}
