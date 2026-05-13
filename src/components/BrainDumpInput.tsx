import { useState, useRef, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onAdd: (text: string) => void
}

export default function BrainDumpInput({ onAdd }: Props) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const [burst, setBurst] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function submit() {
    if (!value.trim()) return
    onAdd(value)
    setValue('')
    setBurst(true)
    setTimeout(() => setBurst(false), 500)
    textareaRef.current?.focus()
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <motion.div
      animate={burst ? { scale: [1, 1.015, 1] } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative"
    >
      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.25) 0%, transparent 70%)',
          opacity: focused ? 1 : 0,
          filter: 'blur(20px)',
          transform: 'translateY(-8px) scaleX(0.9)',
        }}
      />

      <div
        className="relative rounded-2xl overflow-hidden transition-all duration-300"
        style={{
          background: 'rgba(255,255,255,0.025)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: focused
            ? '1px solid rgba(139,92,246,0.5)'
            : burst
            ? '1px solid rgba(167,139,250,0.7)'
            : '1px solid rgba(255,255,255,0.07)',
          boxShadow: focused
            ? '0 0 0 1px rgba(139,92,246,0.1), 0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Joga tudo aqui. Sem julgamento. ✦"
          rows={4}
          autoFocus
          className="w-full bg-transparent resize-none px-6 pt-6 pb-4 text-[17px] text-white/90 placeholder:text-white/15 outline-none leading-relaxed tracking-[-0.01em]"
        />

        <div
          className="flex items-center justify-between px-6 py-3 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/20 font-medium tracking-wide">
              ↵ soltar
            </span>
            <span className="text-[11px] text-white/10">⇧↵ nova linha</span>
          </div>

          <AnimatePresence>
            {value.trim() && (
              <motion.button
                initial={{ opacity: 0, x: 8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 8, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                onClick={submit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[13px] font-semibold cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
                }}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(124,58,237,0.5)' }}
                whileTap={{ scale: 0.96 }}
              >
                Soltar
                <span className="opacity-70">→</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
