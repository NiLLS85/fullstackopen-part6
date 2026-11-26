import { create } from 'zustand'

let timeoutId = null

const useNotificationStore = create(set => ({
  message: '',
  actions: {
    show: (message, seconds = 5) => {
      clearTimeout(timeoutId)
      set(() => ({ message }))
      timeoutId = setTimeout(() => set(() => ({ message: '' })), seconds * 1000)
    },
    clear: () => {
      clearTimeout(timeoutId)
      set(() => ({ message: '' }))
    },
  },
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)

export default useNotificationStore
