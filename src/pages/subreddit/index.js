import React from 'react'
import { Link } from 'react-router-dom'
import { getRemovedThreadIDs } from '../../api/removeddit'
import { getThreads } from '../../api/reddit'
import Post from '../common/Post'

const getSubredditForAPI = props => {
  const { subreddit = 'all' } = props.match.params
  if (subreddit.toLowerCase() === 'all') {
    return ''
  }
  return subreddit.toLowerCase()
}

export default class Subreddit extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      threads: [],
      subreddit: ''
    }
  }

  componentDidMount () {
    this.getRemovedThreads(this.props)
  }

  componentWillReceiveProps (nextProps) {
    const newSubreddit = getSubredditForAPI(nextProps)

    if (this.state.subreddit !== newSubreddit) {
      this.getRemovedThreads(nextProps)
    }
  }

  getRemovedThreads (props) {
    const subreddit = getSubredditForAPI(props)
    getRemovedThreadIDs(subreddit)
      .then(threadIDs => getThreads(threadIDs))
      .then(threads => {
        threads.forEach(thread => {
          thread.removed = true
          thread.selftext = ''
        })
        this.setState({ threads, subreddit })
      })
  }

  render () {
    const { subreddit = 'all' } = this.props.match.params
    const subredditLink = `/r/${subreddit}`

    return (
      <React.Fragment>
        <div className='subreddit-box'>
          <Link to={subredditLink} className='subreddit-title'>{subredditLink}</Link>
          <span className='space' />
          <a href={`https://www.reddit.com${subredditLink}`} className='subreddit-title-link'>reddit</a>
          <span className='space' />
          <a href={`https://snew.github.io${subredditLink}`} className='subreddit-title-link'>ceddit</a>
        </div>
        {
          this.state.threads.map(thread => (
            <Post key={thread.id} {...thread} />
          ))
        }
      </React.Fragment>
    )
  }
}
