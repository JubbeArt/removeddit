import {createStore} from './store'
import {get, showFunctions, sortFunctions} from '../utils'
import {html} from 'lit-html/lib/lit-extended'

export const commentSort = {
  top: 'top',
  bottom: 'bottom',
  new: 'new',
  old: 'old'
}

export const commentShow = {
  all: 'all',
  removedDeleted: 'removedDeleted',
  removed: 'removed',
  deleted: 'deleted'
}

export const store = createStore({
  commentSort: get('commentSort', commentSort.top),
  commentShow: get('commentShow', commentShow.removedDeleted),
  subreddit: undefined,
  threadID: undefined,
  commentID: undefined,
  threads: [],
  thread: undefined,
  allComments: [],
  statusText: undefined,
  statusImage: undefined,
  template: html``,
  comments: () => {
    return store.getState().allComments
      .filter(showFunctions[store.getState().currentShow])
      .sort(sortFunctions[store.getState().currentSort])
  }
}, ['commentSort', 'commentShow'])

export const stateImages = {
  loading: '/images/loading.gif',
  error: '/images/error.png',
  success: '/images/done.png'
}
