import { render } from 'lit-html/lib/lit-extended'
import Navigo from 'navigo'
import aboutTemplate from './templates/about'
import threadTemplate from './templates/thread'
import subredditTemplate from './templates/subreddit'
import {store} from './state'
import getThreads from './core/subreddit'

const router = new Navigo(window.location.origin)

const main = document.getElementById('main')

// Causes a rerender of the currently selected template
const renderPage = () => {
  const template = store.getState().template(store.getState(), store.setState)
  render(template, main)
}

// Re-render page whenever state is changed
store.subscribe(() => renderPage())

router.on({
  '/about': () => {
    store.setState({template: aboutTemplate})
  },
  '/r/:subreddit/comments/:threadID/:junk/:commentID': ({subreddit, threadID, commentID}) => {
    store.setState({template: threadTemplate, subreddit, threadID, commentID})
  },
  '/r/:subreddit/comments/:threadID*': ({subreddit, threadID}) => {
    store.setState({template: threadTemplate, subreddit, threadID, commentID: undefined})
  },
  '/r/:subreddit': ({subreddit}) => {
    store.setState({template: subredditTemplate, threads: [], subreddit, threadID: undefined, commentID: undefined})
    getThreads(subreddit, store.setState)
  },
  '*': () => {
    store.setState({template: subredditTemplate, threads: [], subreddit: 'all', threadID: undefined, commentID: undefined})
    getThreads('all', store.setState)
  }
}).resolve()
