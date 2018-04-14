import { html, render } from 'lit-html'
import Navigo from 'navigo'
import aboutTemplate from './templates/about'
import threadTemplate from './templates/thread'
import subredditTemplate from './templates/subreddit'
import {store} from 'state'
// import p from 'snudown-js'

const router = new Navigo(window.location.origin)
// router.updatePageLinks()

let currentTemplate = html``
const main = document.getElementById('main')

const renderMain = () => render(currentTemplate(store.getState(), store.setState), main)
store.subscribe(() => renderMain())

router.on({
  '/about': () => {
    currentTemplate = aboutTemplate
    renderMain()
  },
  '/r/:subreddit/comments/:threadID/:junk/:commentID': params => {
    const {subreddit, threadID, commentID} = params
    store.setState({subreddit, threadID, commentID})
    currentTemplate = threadTemplate
    renderMain()
  },
  '/r/:subreddit/comments/:threadID/:junk': params => {
    const {subreddit, threadID} = params
    store.setState({subreddit, threadID, commentID: undefined})
    currentTemplate = threadTemplate
    renderMain()
  },
  '/r/:subreddit/comments/:threadID': params => {
    const {subreddit, threadID} = params
    store.setState({subreddit, threadID, commentID: undefined})
    currentTemplate = threadTemplate
    renderMain()
  },
  '/r/:subreddit': params => {
    const {subreddit} = params
    store.setState({subreddit, threadID: undefined, commentID: undefined})
    currentTemplate = subredditTemplate
    renderMain()
  },
  '*': () => {
    store.setState({subreddit: 'all', threadID: undefined, commentID: undefined})
    currentTemplate = subredditTemplate
    renderMain()
  }
}).resolve()
