const baseUrl = 'http://localhost:3001/anecdotes'

// Si el servidor responde con error, se lanza con su mensaje (p. ej. "too short anecdote...")
const parse = async response => {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.error ?? `request failed with status ${response.status}`)
  }
  return response.json()
}

export const getAnecdotes = async () => parse(await fetch(baseUrl))

export const createAnecdote = async content =>
  parse(
    await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, votes: 0 }),
    })
  )

export const updateAnecdote = async anecdote =>
  parse(
    await fetch(`${baseUrl}/${anecdote.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(anecdote),
    })
  )
