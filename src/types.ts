export type CategoryId = 'dump' | 'agora' | 'depois' | 'ideia' | 'sentimento' | 'lembrete'

export interface Category {
  id: CategoryId
  label: string
  emoji: string
  color: string
  bg: string
  border: string
}

export interface Thought {
  id: string
  text: string
  category: CategoryId
  createdAt: number
}

export const CATEGORIES: Category[] = [
  { id: 'dump',       label: 'Soltos',      emoji: '🌀', color: '#6b7280', bg: 'rgba(107,114,128,0.06)', border: 'rgba(107,114,128,0.15)' },
  { id: 'agora',      label: 'Agora',       emoji: '⚡', color: '#fbbf24', bg: 'rgba(251,191,36,0.06)',  border: 'rgba(251,191,36,0.2)'  },
  { id: 'depois',     label: 'Depois',      emoji: '📅', color: '#60a5fa', bg: 'rgba(96,165,250,0.06)',  border: 'rgba(96,165,250,0.2)'  },
  { id: 'ideia',      label: 'Ideia',       emoji: '💡', color: '#c084fc', bg: 'rgba(192,132,252,0.06)', border: 'rgba(192,132,252,0.2)' },
  { id: 'sentimento', label: 'Sentimento',  emoji: '💜', color: '#f472b6', bg: 'rgba(244,114,182,0.06)', border: 'rgba(244,114,182,0.2)' },
  { id: 'lembrete',   label: 'Lembrete',    emoji: '📌', color: '#34d399', bg: 'rgba(52,211,153,0.06)',  border: 'rgba(52,211,153,0.2)'  },
]
