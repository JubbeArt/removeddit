const images = {
  loading: '/images/loading.gif',
  error: '/images/error.png',
  success: '/images/done.png'
}

// Action types
const STATUS_SET_LOADING = 'STATUS_SET_LOADING'
const STATUS_SET_SUCCESS = 'STATUS_SET_SUCCESS'
const STATUS_SET_ERROR = 'STATUS_SET_ERROR'

// Action creators
export const setStatusLoading = (payload = '') => ({ type: STATUS_SET_LOADING, payload })
export const setStatusSuccess = (payload = '') => ({ type: STATUS_SET_SUCCESS, payload })
export const setStatusError = (payload = '') => ({ type: STATUS_SET_ERROR, payload })

// Init state
const initialStatusState = {
  text: null,
  image: null
}

export const statusReducer = (state = initialStatusState, action) => {
  switch (action.type) {
    case STATUS_SET_SUCCESS:
      return {
        ...state,
        text: action.payload,
        image: images.success
      }
    case STATUS_SET_LOADING:
      return {
        ...state,
        text: action.payload,
        image: images.loading
      }
    case STATUS_SET_ERROR:
      return {
        ...state,
        text: action.payload,
        image: images.error
      }
    default:
      return state
  }
}
