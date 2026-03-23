import React, { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ChannelCard } from './Card.jsx'

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: 'easeOut',
    },
  }),
}

export function ChannelRow({ category, channels, activeChannel, onChannelSelect, rowIndex }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, scrollLeft: 0 })

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const amount = 600
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
    setTimeout(updateScrollState, 400)
  }

  // Mouse drag scroll
  const onMouseDown = (e) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, scrollLeft: scrollRef.current?.scrollLeft || 0 }
  }
  const onMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const dx = e.clientX - dragStart.current.x
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx
    updateScrollState()
  }
  const onMouseUp = () => setIsDragging(false)

  if (!channels || channels.length === 0) return null

  return (
    <motion.section
      className="relative mb-8"
      custom={rowIndex}
      variants={rowVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {/* Row header */}
      <div className="flex items-center justify-between mb-4 px-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.icon}</span>
          <h2 className="text-white font-display text-2xl tracking-wide">
            {category.label}
          </h2>
          <span className="text-white/30 text-sm font-mono mt-1">
            {channels.length} channels
          </span>
        </div>

        {/* Desktop scroll arrows */}
        <div className="hidden md:flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`w-8 h-8 rounded-full flex items-center justify-center 
                       transition-all duration-200 ${
              canScrollLeft
                ? 'glass hover:bg-white/20 text-white'
                : 'bg-white/5 text-white/20 cursor-default'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`w-8 h-8 rounded-full flex items-center justify-center 
                       transition-all duration-200 ${
              canScrollRight
                ? 'glass hover:bg-white/20 text-white'
                : 'bg-white/5 text-white/20 cursor-default'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Left fade gradient */}
      <div className={`absolute left-0 top-12 bottom-0 w-16 bg-gradient-to-r from-bg-primary 
                       to-transparent z-10 pointer-events-none transition-opacity duration-300
                       ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

      {/* Right fade gradient */}
      <div className={`absolute right-0 top-12 bottom-0 w-16 bg-gradient-to-l from-bg-primary 
                       to-transparent z-10 pointer-events-none transition-opacity duration-300
                       ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className={`row-scroll px-6 md:px-8 ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        onScroll={updateScrollState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {channels.map((ch, idx) => (
          <ChannelCard
            key={ch.id || `${category.id}-${idx}`}
            channel={ch}
            isActive={activeChannel?.id === ch.id}
            onClick={onChannelSelect}
            index={idx}
          />
        ))}

        {/* Spacer at end */}
        <div className="flex-shrink-0 w-4" />
      </div>
    </motion.section>
  )
}
