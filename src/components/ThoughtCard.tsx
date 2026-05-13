import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Thought, Category } from '../types'
import { CATEGORIES } from '../types'

interface Props {
  thought: Thought
  onMove: (id: string, category: Thought['category']) => void
  onDelete: (id: string) => void
}

export default function ThoughtCard({ thought, onMove, onDelete }: Props) {
  const [hovered, setHovered] = useState(false)
  const current = CATEGORIES.find(c => c.id === thought.category)!
  const others = CATEGORIES.filter(c => c.id !== thought.category && c.id !== 'dump')

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, y: 4, transition: { duration: 0.18 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="relative rounded-xl overflow-hidden cursor-default"
      style={{
        background: 'rgba(255,255,255,0.025)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${hovered ? current.border : 'rgba(255,255,255,0.06)'}`,
        borderLeft: `2px solid ${current.color}`,
        boxShadow: hovered
          ? `0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px ${current.border}`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transition: 'border 0.2s, box-shadow 0.2s',
      }}
    >
      <div
        className="absolute inset-y-0 left-0 w-0.5 rounded-full"
        style={{
          background: `linear-gradient(to bottom, ${current.color}, transparent)`,
          opacity: 0.6,
        }}
      />

      <div className="px-4 pt-3 pb-3">
        <div className="flex items-start gap-2.5">
          <span className="shrink-0 text-base leading-6">{current.emoji}</span>
          <p className="flex-1 text-sm text-white/75 leading-relaxed">{thought.text}</p>
          <button
            onClick={() => onDelete(thought.id)}
            className="shrink-0 w-5 h-5 flex items-center justify-center rounded-md text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer text-base leading-none"
            style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}
          >
            ×
          </button>
        </div>

        <AnimatePresence>
          {hovered && others.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="flex flex-wrap gap-1.5 overflow-hidden"
            >
              {others.map((cat: Category) => (
                <motion.button
                  key={cat.id}
                  onClick={() => onMove(thought.id, cat.id)}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-colors"
                  style={{
                    background: cat.bg,
                    border: `1px solid ${cat.border}`,
                    color: cat.color,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <span className="text-[10px]">{cat.emoji}</span>
                  {cat.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
