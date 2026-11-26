const baseUrl = 'http://localhost:3001/anecdotes'

const handle = async (response, action) => {
  if (!response.ok) {
    throw new Error(`Failed to ${action} anecdotes`)
  }
  return response.status === 204 ? null : response.json()
}

const getAll = async () => {
  const response = await fetch(baseUrl)
  return handle(response, 'fetch')
}

const createNew = async content => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  return handle(response, 'create')
}

const update = async (id, anecdote) => {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(anecdote),
  })
  return handle(response, 'update')
}

const remove = async id => {
  const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
  return handle(response, 'delete')
}

export default { getAll, createNew, update, remove }
