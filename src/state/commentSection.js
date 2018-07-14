import { get, put } from 'utils'

// Sort types
export const SORT_TOP = 'SORT_TOP'
export const SORT_BOTTOM = 'SORT_BOTTOM'
export const SORT_NEW = 'SORT_NEW'
export const SORT_OLD = 'SORT_OLD'

// Filter types
export const SHOW_ALL = 'SHOW_ALL'
export const SHOW_REMOVED_DELETED = 'SHOW_REMOVED_DELETED'
export const SHOW_REMOVED = 'SHOW_REMOVED'
export const SHOW_DELETED = 'SHOW_DELETED'

// Action types
export const COMMENT_SORT = 'COMMENT_SORT'
export const COMMENT_SHOW = 'COMMENT_SHOW'

// Action creators
export const setCommentSort = payload => ({ type: COMMENT_SORT, payload })
export const setCommentShow = payload => ({ type: COMMENT_SHOW, payload })

const sortKey = 'commentSort'
const filterKey = 'commentFilter'

// Init state
const initialStatusState = {
  sort: get(sortKey, SORT_TOP),
  show: get(filterKey, SHOW_REMOVED_DELETED)
}

export const commentSectionReducer = (state = initialStatusState, action) => {
  switch (action.type) {
    case COMMENT_SORT:
      put(sortKey, action.payload)
      return {
        ...state,
        sort: action.payload
      }
    case COMMENT_SHOW:
      put(filterKey, action.payload)
      return {
        ...state,
        show: action.payload
      }
    default:
      return state
  }
}
