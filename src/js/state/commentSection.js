// Sort types
export const SORT_TOP = 'SORT_TOP'
export const SORT_BOTTOM = 'SORT_BOTTOM'
export const SORT_NEW = 'SORT_NEW'
export const SORT_OLD = 'SORT_OLD'

// Show types
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

// Init state
const initialStatusState = {
  sort: SORT_TOP,
  show: SHOW_REMOVED_DELETED,
}

export const commentSectionReducer = (state = initialStatusState, action) => {
  switch (action.type) {
    case COMMENT_SORT:
      return {
        ...state,
        sort: action.payload,
      }
    case COMMENT_SHOW:
      return {
        ...state,
        show: action.payload,
      }
    default:
      return state
  }
}
