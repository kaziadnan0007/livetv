import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Play } from 'lucide-react'
import { formatViewers, getFallbackImage } from '../utils/parseM3U.js'

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1, scale: 1,
    transition: { duration: 0.3 },
  },
  hover: {
    scale: 1.05,
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  tap: { scale: 0.97 },
}

export function ChannelCard({ channel, isActive, onClick, index }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const imgSrc = (!channel.logo || imgError)
    ? getFallbackImage(channel)
    : channel.logo

  return (
    <motion.div
      className="channel-card relative cursor-pointer"
      style={{ width: 200, minWidth: 200 }}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onClick={() => onClick(channel)}
      custom={index}
      layout
    >
      {/* Card container */}
      <div
        className={`relative rounded-xl overflow-hidden border transition-all duration-300 ${
          isActive
            ? 'border-red-500 shadow-glow-red ring-1 ring-red-500/50'
            : 'border-white/10 hover:border-white/30'
        }`}
        style={{ height: 120 }}
      >
        {/* Thumbnail */}
        <div className="absolute inset-0 bg-bg-card">
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}
          <img
            src={imgSrc}
            alt={channel.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={() => setImgError(true)}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Live badge — top right */}
        <div className="absolute top-2 right-2">
          <motion.div
            className="live-badge animate-pulse-glow"
            animate={{
              boxShadow: [
                '0 0 4px rgba(229,9,20,0.6)',
                '0 0 12px rgba(229,9,20,0.9)',
                '0 0 4px rgba(229,9,20,0.6)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
            LIVE
          </motion.div>
        </div>

        {/* Active indicator */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-2 left-2"
          >
            <div className="flex items-center gap-1 bg-red-600/90 backdrop-blur-sm rounded-full px-2 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white text-[10px] font-bold">NOW</span>
            </div>
          </motion.div>
        )}

        {/* Play overlay on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
        >
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm 
                          flex items-center justify-center border border-white/40">
            <Play className="w-4 h-4 text-white fill-white ml-0.5" />
          </div>
        </motion.div>

        {/* Channel info — bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-white text-xs font-semibold leading-tight truncate font-body">
            {channel.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Eye className="w-2.5 h-2.5 text-white/40" />
            <span className="text-white/40 text-[10px] font-mono">
              {formatViewers(channel.viewers)}
            </span>
          </div>
        </div>

        {/* Glass border glow on active */}
        {isActive && (
          <div className="absolute inset-0 rounded-xl border-2 border-red-500/60 
                          pointer-events-none animate-pulse-glow" />
        )}
      </div>
    </motion.div>
  )
}
