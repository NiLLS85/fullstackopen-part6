import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, render, renderHook, screen } from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdoteActions, useAnecdotes } from './store'
import AnecdoteList from './components/AnecdoteList'

const backendAnecdotes = [
  { id: '1', content: 'Real artists ship code', votes: 7 },
  { id: '2', content: 'Make it work, then make it fast', votes: 0 },
  { id: '3', content: 'Untested code is broken code', votes: 3 },
  { id: '4', content: 'Simplicity is the ultimate sophistication', votes: 5 },
]

// Carga las anécdotas en la tienda a través de la acción, igual que la aplicación
const initializeFromBackend = async () => {
  anecdoteService.getAll.mockResolvedValue(backendAnecdotes)
  const { result } = renderHook(() => useAnecdoteActions())
  await act(async () => {
    await result.current.initialize()
  })
  return result
}

const renderedContents = () =>
  screen.getAllByText(/./, { selector: '.anecdote > div:first-child' }).map(
    element => element.textContent
  )

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe('anecdote store', () => {
  // 6.12
  it('initializes the state with the anecdotes returned by the backend', async () => {
    await initializeFromBackend()

    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
    expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes)
  })

  // 6.13
  it('gives the anecdote list the anecdotes sorted by votes', async () => {
    await initializeFromBackend()

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.map(a => a.votes)).toEqual([7, 5, 3, 0])

    render(<AnecdoteList />)
    expect(renderedContents()).toEqual([
      'Real artists ship code',
      'Simplicity is the ultimate sophistication',
      'Untested code is broken code',
      'Make it work, then make it fast',
    ])
  })

  // 6.14
  it('gives the anecdote list only the anecdotes matching the filter', async () => {
    const actions = await initializeFromBackend()
    act(() => {
      actions.current.setFilter('CODE')
    })

    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.map(a => a.content)).toEqual([
      'Real artists ship code',
      'Untested code is broken code',
    ])

    render(<AnecdoteList />)
    expect(renderedContents()).toEqual([
      'Real artists ship code',
      'Untested code is broken code',
    ])
  })

  // 6.15
  it('voting increases the votes of the anecdote by one', async () => {
    const actions = await initializeFromBackend()
    anecdoteService.update.mockImplementation(async (id, anecdote) => anecdote)

    await act(async () => {
      await actions.current.vote('3')
    })

    expect(anecdoteService.update).toHaveBeenCalledWith('3', {
      id: '3',
      content: 'Untested code is broken code',
      votes: 4,
    })
    const voted = useAnecdoteStore.getState().anecdotes.find(a => a.id === '3')
    expect(voted.votes).toBe(4)
  })

  it('adding an anecdote appends the one returned by the backend', async () => {
    await initializeFromBackend()
    const created = { id: '5', content: 'Freshly baked wisdom', votes: 0 }
    anecdoteService.createNew.mockResolvedValue(created)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.add('Freshly baked wisdom')
    })

    expect(anecdoteService.createNew).toHaveBeenCalledWith('Freshly baked wisdom')
    expect(useAnecdoteStore.getState().anecdotes).toContainEqual(created)
  })

  it('removing an anecdote deletes it from the state', async () => {
    await initializeFromBackend()
    anecdoteService.remove.mockResolvedValue(null)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.remove('2')
    })

    expect(anecdoteService.remove).toHaveBeenCalledWith('2')
    expect(useAnecdoteStore.getState().anecdotes.map(a => a.id)).not.toContain('2')
  })
})
