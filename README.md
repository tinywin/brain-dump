# brain dump

Esvazia a cabeça. Depois organiza.

Um app para quem tem pensamentos demais ao mesmo tempo — joga tudo fora de uma vez, depois categoriza na calma (ou deixa a IA fazer isso).

![brain dump preview](https://raw.githubusercontent.com/placeholder/brain-dump/main/preview.png)

## O que faz

- **Dump livre** — escreve sem pensar, sem estrutura, só joga pra fora
- **Categorias** — Agora, Depois, Ideia, Sentimento, Lembrete
- **Auto-sort com IA** — usa Claude (Anthropic) pra categorizar tudo automaticamente
- **Persiste local** — tudo fica salvo no browser via localStorage

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Framer Motion
- Anthropic SDK (Claude claude-opus-4-7)

## Rodar local

```bash
npm install
npm run dev
```

## Auto-sort com IA

Clica em **✦ Auto-sort** na seção "Soltos" e insere sua [chave da API Anthropic](https://console.anthropic.com/). A chave fica só no seu browser (localStorage), nunca vai a nenhum servidor.
