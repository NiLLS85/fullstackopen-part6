import { create } from 'zustand'

import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create(set => ({
  anecdotes: [],
  filter: '',
  actions: {
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    add: async content => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
      return newAnecdote
    },
    vote: async id => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      const updated = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      })
      set(state => ({
        anecdotes: state.anecdotes.map(a => (a.id === id ? updated : a)),
      }))
      return updated
    },
    remove: async id => {
      await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(a => a.id !== id) }))
    },
    setFilter: filter => set(() => ({ filter })),
  },
}))

const byVotes = (a, b) => b.votes - a.votes

// Los selectores devuelven el estado tal cual; filtrar y ordenar se hace fuera
// con toSorted para no mutar el estado ni crear un array nuevo en cada selección.
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore(state => state.anecdotes)
  const filter = useAnecdoteStore(state => state.filter)
  const term = filter.trim().toLowerCase()

  return anecdotes
    .filter(a => a.content.toLowerCase().includes(term))
    .toSorted(byVotes)
}

export const useFilter = () => useAnecdoteStore(state => state.filter)
export const useAnecdoteActions = () => useAnecdoteStore(state => state.actions)

export default useAnecdoteStore
