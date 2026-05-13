import { useState, useRef, type KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Anthropic from '@anthropic-ai/sdk'
import type { Thought, CategoryId } from '../types'
import { autoSort } from '../utils/autoSort'

const KEY_STORAGE = 'anthropic-api-key'

interface Props {
  thoughts: Thought[]
  onSort: (id: string, category: CategoryId) => void
}

export default function AutoSortButton({ thoughts, onSort }: Props) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORAGE) ?? '')
  const [showInput, setShowInput] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function runSort(key: string) {
    if (thoughts.length === 0) return
    setLoading(true)
    setError('')
    try {
      const results = await autoSort(thoughts, key)
      results.forEach(r => onSort(r.id, r.category))
    } catch (e) {
      if (
        e instanceof Anthropic.AuthenticationError ||
        (e instanceof Error && (e.message.includes('401') || e.message.toLowerCase().includes('api key')))
      ) {
        setError('Chave inválida')
        setApiKey('')
        localStorage.removeItem(KEY_STORAGE)
        setShowInput(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      } else {
        setError('Erro — tente de novo')
      }
    } finally {
      setLoading(false)
    }
  }

  function handleClick() {
    if (loading) return
    if (!apiKey) {
      setShowInput(v => !v)
      setKeyDraft('')
      setTimeout(() => inputRef.current?.focus(), 50)
      return
    }
    runSort(apiKey)
  }

  function saveAndSort() {
    const trimmed = keyDraft.trim()
    if (!trimmed) return
    localStorage.setItem(KEY_STORAGE, trimmed)
    setApiKey(trimmed)
    setShowInput(false)
    runSort(trimmed)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') saveAndSort()
    if (e.key === 'Escape') { setShowInput(false); setError('') }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={loading}
        whileHover={!loading ? { scale: 1.05 } : {}}
        whileTap={!loading ? { scale: 0.95 } : {}}
        className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer"
        style={{
          color: loading ? 'rgba(192,132,252,0.45)' : 'rgba(192,132,252,0.75)',
          transition: 'color 0.2s',
        }}
      >
        <motion.span
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={loading ? { duration: 1.2, repeat: Infinity, ease: 'linear' } : {}}
          className="inline-block"
        >
          ✦
        </motion.span>
        {loading ? 'Sorteando…' : 'Auto-sort'}
      </motion.button>

      <AnimatePresence>
        {(showInput || error) && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="absolute right-0 top-7 z-30 p-3 rounded-xl"
            style={{
              background: 'rgba(10,10,20,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(192,132,252,0.18)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
              width: '240px',
            }}
          >
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[11px] text-red-400/80 mb-2"
              >
                {error}
              </motion.p>
            )}
            <p className="text-[11px] text-white/35 mb-2 leading-relaxed">
              Chave da API Anthropic<br />
              <span className="text-white/20">Fica só no seu browser.</span>
            </p>
            <input
              ref={inputRef}
              type="password"
              value={keyDraft}
              onChange={e => setKeyDraft(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="sk-ant-..."
              className="w-full text-[12px] bg-transparent rounded-lg px-3 py-2 text-white/80 placeholder:text-white/20 outline-none transition-colors"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'rgba(192,132,252,0.4)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <div className="flex items-center justify-between mt-2.5">
              <button
                onClick={() => { setShowInput(false); setError('') }}
                className="text-[11px] text-white/25 hover:text-white/50 cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <motion.button
                onClick={saveAndSort}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="text-[11px] font-semibold cursor-pointer px-3 py-1 rounded-lg transition-colors"
                style={{
                  background: 'rgba(192,132,252,0.15)',
                  border: '1px solid rgba(192,132,252,0.25)',
                  color: 'rgba(192,132,252,0.9)',
                }}
              >
                Usar ↵
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
