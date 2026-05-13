import Anthropic from '@anthropic-ai/sdk'
import type { Thought, CategoryId } from '../types'

export async function autoSort(
  thoughts: Thought[],
  apiKey: string,
): Promise<{ id: string; category: CategoryId }[]> {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 1024,
    system:
      'You are a thought organizer for a brain dump app. Categorize each thought into exactly one category. Always call the categorize_thoughts tool with all provided thoughts.',
    tools: [
      {
        name: 'categorize_thoughts',
        description: 'Assign each thought to its most fitting category',
        input_schema: {
          type: 'object',
          properties: {
            results: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  category: {
                    type: 'string',
                    enum: ['agora', 'depois', 'ideia', 'sentimento', 'lembrete'],
                    description:
                      'agora=urgent/now, depois=later/future, ideia=idea/creative, sentimento=feeling/emotion, lembrete=reminder/note',
                  },
                },
                required: ['id', 'category'],
              },
            },
          },
          required: ['results'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'categorize_thoughts' },
    messages: [
      {
        role: 'user',
        content: `Categorize these thoughts (may be in Portuguese or English):\n\n${thoughts
          .map(t => `ID: ${t.id}\nText: "${t.text}"`)
          .join('\n\n')}`,
      },
    ],
  })

  const toolUse = response.content.find(b => b.type === 'tool_use')
  if (!toolUse || toolUse.type !== 'tool_use') {
    throw new Error('No categorization returned')
  }

  const input = toolUse.input as { results: { id: string; category: string }[] }
  return input.results.map(r => ({ id: r.id, category: r.category as CategoryId }))
}
