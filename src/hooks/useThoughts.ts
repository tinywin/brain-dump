import { useState, useEffect } from 'react'
import type { Thought, CategoryId } from '../types'

const STORAGE_KEY = 'brain-dump-thoughts'

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts))
  }, [thoughts])

  function addThought(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setThoughts(prev => [
      { id: crypto.randomUUID(), text: trimmed, category: 'dump', createdAt: Date.now() },
      ...prev,
    ])
  }

  function moveThought(id: string, category: CategoryId) {
    setThoughts(prev =>
      prev.map(t => (t.id === id ? { ...t, category } : t))
    )
  }

  function deleteThought(id: string) {
    setThoughts(prev => prev.filter(t => t.id !== id))
  }

  function clearCategory(category: CategoryId) {
    setThoughts(prev => prev.filter(t => t.category !== category))
  }

  return { thoughts, addThought, moveThought, deleteThought, clearCategory }
}
