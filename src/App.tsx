import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES } from './types'
import { useThoughts } from './hooks/useThoughts'
import BrainDumpInput from './components/BrainDumpInput'
import CategorySection from './components/CategorySection'
import ThoughtCard from './components/ThoughtCard'
import AutoSortButton from './components/AutoSortButton'

export default function App() {
  const { thoughts, addThought, moveThought, deleteThought, clearCategory } = useThoughts()

  const dumped = thoughts.filter(t => t.category === 'dump')
  const sortedCats = CATEGORIES.filter(c => c.id !== 'dump')
  const totalSorted = thoughts.filter(t => t.category !== 'dump').length
  const hasSorted = totalSorted > 0

  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{
            top: '-15%', left: '-10%',
            width: 700, height: 700,
            background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 65%)',
          }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute"
          style={{
            bottom: '-20%', right: '-15%',
            width: 800, height: 800,
            background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)',
          }}
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
          className="absolute"
          style={{
            top: '40%', right: '20%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(244,114,182,0.06) 0%, transparent 65%)',
          }}
        />
        {/* Noise overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '180px',
          }}
        />
      </div>

      {/* Main layout */}
      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto px-6 py-12">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-1">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(167,139,250,0.25)',
                  boxShadow: '0 4px 12px rgba(124,58,237,0.2)',
                }}
              >
                🧠
              </div>
              <h1
                className="text-2xl font-semibold tracking-[-0.04em]"
                style={{
                  background: 'linear-gradient(135deg, #fff 30%, rgba(167,139,250,0.9) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                brain dump
              </h1>
            </div>
            <p className="text-[13px] text-white/25 pl-12 font-medium tracking-wide">
              Esvazia a cabeça. Depois organiza.
            </p>
          </motion.div>

          {/* Two-column layout at lg+ */}
          <div className="flex gap-8 items-start" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

            {/* Left column — input + dump pile */}
            <div className="flex flex-col gap-5 min-w-0" style={{ flex: '1 1 340px', maxWidth: 480 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <BrainDumpInput onAdd={addThought} />
              </motion.div>

              {/* Stats strip */}
              <AnimatePresence>
                {thoughts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 px-1"
                  >
                    <div className="flex items-center gap-2 text-[12px] text-white/25 font-medium">
                      <span className="tabular-nums">{thoughts.length} pensamento{thoughts.length !== 1 ? 's' : ''}</span>
                      {totalSorted > 0 && (
                        <>
                          <span className="opacity-40">·</span>
                          <span style={{ color: 'rgba(192,132,252,0.7)' }}>{totalSorted} organizado{totalSorted !== 1 ? 's' : ''}</span>
                        </>
                      )}
                      {dumped.length > 0 && (
                        <>
                          <span className="opacity-40">·</span>
                          <span>{dumped.length} solto{dumped.length !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dump pile */}
              <AnimatePresence mode="popLayout">
                {dumped.length > 0 && (
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30">
                          Soltos
                        </span>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white/30 tabular-nums"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {dumped.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <AutoSortButton thoughts={dumped} onSort={moveThought} />
                        {dumped.length > 1 && (
                          <button
                            onClick={() => clearCategory('dump')}
                            className="text-[11px] text-white/20 hover:text-red-400 cursor-pointer transition-colors"
                          >
                            limpar
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <AnimatePresence mode="popLayout">
                        {dumped.map(t => (
                          <ThoughtCard key={t.id} thought={t} onMove={moveThought} onDelete={deleteThought} />
                        ))}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              <AnimatePresence>
                {thoughts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col items-center gap-3 py-16 text-center"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                      className="text-5xl opacity-10"
                    >
                      🌀
                    </motion.div>
                    <p className="text-sm text-white/20 leading-relaxed">
                      Tá tudo na cabeça ainda.<br />
                      <span className="text-white/10">Começa jogando aqui.</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right column — sorted categories */}
            <AnimatePresence>
              {hasSorted && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                  className="flex flex-col gap-6 min-w-0"
                  style={{ flex: '1 1 300px' }}
                >
                  {/* Divider line visible only on wide layout */}
                  <div
                    className="absolute h-full w-px pointer-events-none hidden lg:block"
                    style={{
                      background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06) 20%, rgba(255,255,255,0.06) 80%, transparent)',
                      left: '50%',
                      top: 0,
                    }}
                  />

                  <AnimatePresence mode="popLayout">
                    {sortedCats.map(cat => (
                      <CategorySection
                        key={cat.id}
                        category={cat}
                        thoughts={thoughts.filter(t => t.category === cat.id)}
                        onMove={moveThought}
                        onDelete={deleteThought}
                        onClear={() => clearCategory(cat.id)}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  )
}
