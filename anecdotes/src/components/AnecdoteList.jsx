import { useAnecdoteActions, useAnecdotes } from '../store'
import { useNotificationActions } from '../notificationStore'

const Anecdote = ({ anecdote, onVote, onDelete }) => (
  <div className="anecdote">
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes}
      <button onClick={() => onVote(anecdote)}>vote</button>
      {anecdote.votes === 0 && (
        <button onClick={() => onDelete(anecdote)}>delete</button>
      )}
    </div>
  </div>
)

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote, remove } = useAnecdoteActions()
  const { show } = useNotificationActions()

  const handleVote = async anecdote => {
    await vote(anecdote.id)
    show(`you voted '${anecdote.content}'`)
  }

  const handleDelete = async anecdote => {
    await remove(anecdote.id)
    show(`you deleted '${anecdote.content}'`)
  }

  return (
    <div>
      {anecdotes.map(anecdote => (
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          onVote={handleVote}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}

export default AnecdoteList
