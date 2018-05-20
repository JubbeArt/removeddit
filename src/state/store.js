import {put} from '../utils'

export const createStore = (initState = {}, persistentKeys = []) => {
  let state = initState
  let callbacks = []

  return {
    getState: () => state,
    setState: nextState => {
      Object.keys(nextState).forEach(key => {
        if (persistentKeys.includes(key)) {
          put(key, nextState[key])
        }
      })

      state = {
        ...state,
        ...nextState
      }

      callbacks.forEach(callback => {
        callback(state)
      })
    },
    subscribe: callback => {
      callbacks.push(callback)

      return () => {
        callbacks = callbacks.filter(c => c !== callback)
      }
    }
  }
}
