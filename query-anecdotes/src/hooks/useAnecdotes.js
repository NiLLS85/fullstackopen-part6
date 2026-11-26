import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createAnecdote, getAnecdotes, updateAnecdote } from '../requests'

const QUERY_KEY = ['anecdotes']

// Todo lo de TanStack Query queda aquí; los componentes solo usan este hook.
export const useAnecdotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: QUERY_KEY,
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: newAnecdote => {
      const anecdotes = queryClient.getQueryData(QUERY_KEY) ?? []
      queryClient.setQueryData(QUERY_KEY, anecdotes.concat(newAnecdote))
    },
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: updated => {
      const anecdotes = queryClient.getQueryData(QUERY_KEY) ?? []
      queryClient.setQueryData(
        QUERY_KEY,
        anecdotes.map(a => (a.id === updated.id ? updated : a))
      )
    },
  })

  return {
    anecdotes: result.data ?? [],
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content, options) => newAnecdoteMutation.mutate(content, options),
    voteAnecdote: (anecdote, options) =>
      voteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 }, options),
  }
}
