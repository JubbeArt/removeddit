import aboutTemplate from './templates/about'
import threadTemplate from './templates/thread'
import subredditTemplate from './templates/subreddit'
import getThreads from './core/subreddit'
import SPA from './simpleSPA'

const routes = {
  '/about': (_, setState) => {
    setState({template: aboutTemplate, title: 'About Removeddit'})
  },
  '/r/:subreddit/comments/:threadID/:junk/:commentID': ({subreddit, threadID, commentID}, setState) => {
    setState({template: threadTemplate, subreddit, threadID, commentID})
  },
  '/r/:subreddit/comments/:threadID*': ({subreddit, threadID}, setState) => {
    setState({template: threadTemplate, subreddit, threadID, commentID: undefined})
  },
  '/r/:subreddit': ({subreddit}, setState) => {
    setState({template: subredditTemplate, threads: [], title: `/r/${subreddit}`, subreddit, threadID: undefined, commentID: undefined})
    getThreads(subreddit, setState)
  },
  '*': (_, setState) => {
    setState({template: subredditTemplate, threads: [], title: '/r/all', subreddit: 'all', threadID: undefined, commentID: undefined})
    getThreads('all', setState)
  }
}

const get = (key, defaultValue) => {
  const value = localStorage.getItem(key)

  if (value !== null) {
    return JSON.parse(value)
  }

  return defaultValue
}

const initState = {
  commentSort: get('commentSort', 'top'),
  commentShow: get('commentShow', 'removedDeleted'),
  subreddit: undefined,
  threadID: undefined,
  commentID: undefined,
  threads: [],
  thread: undefined,
  allComments: [],
  statusText: undefined,
  statusImage: undefined,
  title: 'Removeddit'
  // comments: () => {
  //   return store.getState().allComments
  //     .filter(showFunctions[store.getState().currentShow])
  //     .sort(sortFunctions[store.getState().currentSort])
  // }
}

const persistentState = ['commentSort', 'commentShow']

SPA({routes, initState, persistentState, stateLogger: console.log})
