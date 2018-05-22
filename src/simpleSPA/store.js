const put = (key, value) => localStorage.setItem(key, JSON.stringify(value))

export const createStore = (initState = {}, persistentKeys = [], logger) => {
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

      if (typeof logger === 'function') {
        logger(state)
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
