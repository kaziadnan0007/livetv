# 📺 LiveStream — Live TV Streaming App

A production-ready live TV streaming web app with HLS playback, Netflix-style UI, and global IPTV channels.

## ✨ Features

- **Full-viewport Video.js player** — HLS `.m3u8` streams with auto-play, live UI
- **Netflix-style rows** — Sports, News, Movies, Entertainment with 10–60 channels each
- **Instant channel switching** — No page reload, player.src() swap
- **Real IPTV channels** — Auto-fetched from [iptv-org](https://iptv-org.github.io) M3U playlists
- **Glassmorphism UI** — Deep black cinematic theme, blur effects, glow animations
- **Live badges** — Pulsing red glow every 2s, viewer counts
- **Keyboard shortcuts** — ←/→ switch channels, F fullscreen, M mute, ? help
- **PWA installable** — Works offline, installable on mobile/desktop
- **Framer Motion** — Staggered row reveals, card hover lift, toast notifications

## 🚀 Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (Vite proxy handles CORS for M3U)
npm run dev

# 3. Open http://localhost:5173
```

## 🌍 Deploy to Vercel (Free Forever)

### Option A — Vercel CLI (fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod

# Done! Your app is live at https://your-app.vercel.app
```

### Option B — GitHub + Vercel Dashboard (recommended for auto-deploys)
```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "feat: initial LiveStream app"
git remote add origin https://github.com/YOUR_USERNAME/livetv-stream.git
git push -u origin main

# 2. Go to https://vercel.com/new
# 3. Import your GitHub repository
# 4. Vercel auto-detects Vite → click Deploy
# 5. Every git push auto-deploys 🎉
```

### Vercel Settings (auto-detected)
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

The `vercel.json` in this repo sets up:
- **CORS proxy** → `/iptv-proxy/*` → `https://iptv-org.github.io/*`
- Security headers

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `←` / `→` | Previous / Next channel |
| `↑` / `↓` | Previous / Next channel |
| `F` | Toggle fullscreen |
| `M` | Toggle mute |
| `Space` | Play / Pause |
| `?` | Toggle shortcuts help |

## 📁 Project Structure

```
livetv/
├── public/
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Player.jsx         # Video.js HLS player
│   │   ├── HeroSection.jsx    # Full-viewport hero
│   │   ├── NowPlaying.jsx     # Player overlay
│   │   ├── Header.jsx         # Top nav
│   │   ├── Row.jsx            # Horizontal channel row
│   │   ├── Card.jsx           # Channel card
│   │   ├── StatsBar.jsx       # Live stats
│   │   ├── LoadingScreen.jsx  # Animated loader
│   │   ├── ToastNotification.jsx
│   │   └── KeyboardShortcutsModal.jsx
│   ├── hooks/
│   │   ├── useChannels.js     # M3U fetch + parse + cache
│   │   └── useKeyboard.js     # Keyboard navigation
│   ├── utils/
│   │   └── parseM3U.js        # M3U parser + categorizer
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── vercel.json            # Vercel proxy + headers
└── package.json
```

## 🔧 Tech Stack

| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool (fast HMR) |
| Tailwind CSS 3 | Utility-first styling |
| Framer Motion | Animations & transitions |
| Video.js 8 | HLS video playback |
| @videojs/http-streaming | HLS support (VHS) |
| Lucide React | Icons |

## 📡 Channel Sources

All streams are from [iptv-org](https://github.com/iptv-org/iptv) — a community-maintained collection of **free-to-air public channels** from around the world. No copyrighted premium content.

- Main playlist: `https://iptv-org.github.io/iptv/index.m3u`
- Filters: `Sports`, `News`, `Movies`, `Entertainment`

## 🛠 Troubleshooting

**Channels not loading?**
- The M3U fetch uses Vercel's proxy — works in production
- Locally, Vite proxies `/iptv-proxy` → iptv-org
- Click the ↺ refresh button in the top nav to retry

**Stream not playing?**
- Many public IPTV streams go offline intermittently
- Click another channel — fallback streams (NASA TV, CBS News) always work
- Streams are geo-restricted in some regions

**CORS errors in dev?**
- Make sure you're using `npm run dev` (Vite proxy active)
- Or use the deployed Vercel URL

## 📝 License

MIT — free for personal and commercial use.
