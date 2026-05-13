import { motion, AnimatePresence } from 'framer-motion'
import type { Thought, Category } from '../types'
import ThoughtCard from './ThoughtCard'

interface Props {
  category: Category
  thoughts: Thought[]
  onMove: (id: string, cat: Thought['category']) => void
  onDelete: (id: string) => void
  onClear: () => void
}

const container = {
  animate: { transition: { staggerChildren: 0.05 } },
}

export default function CategorySection({ category, thoughts, onMove, onDelete, onClear }: Props) {
  if (thoughts.length === 0) return null

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex flex-col gap-2"
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-1 mb-0.5">
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: category.color, boxShadow: `0 0 6px ${category.color}` }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: category.color }}
          >
            {category.label}
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full tabular-nums"
            style={{
              background: category.bg,
              color: category.color,
              border: `1px solid ${category.border}`,
            }}
          >
            {thoughts.length}
          </span>
        </div>

        {thoughts.length > 1 && (
          <button
            onClick={onClear}
            className="text-[11px] text-white/20 hover:text-red-400 cursor-pointer transition-colors"
          >
            limpar
          </button>
        )}
      </div>

      <motion.div variants={container} animate="animate" className="flex flex-col gap-1.5">
        <AnimatePresence mode="popLayout">
          {thoughts.map(t => (
            <ThoughtCard key={t.id} thought={t} onMove={onMove} onDelete={onDelete} />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
