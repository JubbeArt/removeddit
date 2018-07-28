import React from 'react'
import { Link } from 'react-router-dom'
import { getRemovedThreadIDs } from '../../api/removeddit'
import { getThreads } from '../../api/reddit'
import Post from '../common/Post'
import {connect} from '../../state'

class Subreddit extends React.Component {
  state = {
    threads: [],
    loading: true
  }

  componentDidMount () {
    const { subreddit = 'all' } = this.props.match.params
    this.getRemovedThreads(subreddit)
  }

  // Check if the subreddit has changed in the url, and fetch threads accordingly
  componentDidUpdate (prevProps) {
    const { subreddit: newSubreddit = 'all' } = this.props.match.params
    const { subreddit = 'all' } = prevProps.match.params

    if (subreddit !== newSubreddit) {
      this.getRemovedThreads(newSubreddit)
    }
  }

  // Download thread IDs from removeddit API, then thread info from reddit API
  getRemovedThreads (subreddit) {
    document.title = `/r/${subreddit}`
    this.setState({ threads: [], loading: true })
    this.props.global.setLoading('Loading removed threads...')

    getRemovedThreadIDs(subreddit)
      .then(threadIDs => getThreads(threadIDs))
      .then(threads => {
        threads.forEach(thread => {
          thread.removed = true
          thread.selftext = ''
        })
        this.setState({ threads, loading: false })
        this.props.global.setSuccess()
      })
      .catch(this.props.global.setError)
  }

  render () {
    const { subreddit = 'all' } = this.props.match.params
    const noThreadsFound = this.state.threads.length === 0 && !this.state.loading

    return (
      <React.Fragment>
        <div className='subreddit-box'>
          <Link to={`/r/${subreddit}`} className='subreddit-title'>/r/{subreddit}</Link>
          <span className='space' />
          <a href={`https://www.reddit.com/r/${subreddit}`} className='subreddit-title-link'>reddit</a>
          <span className='space' />
          <a href={`https://snew.github.io/r/${subreddit}`} className='subreddit-title-link'>ceddit</a>
        </div>
        {
          noThreadsFound
            ? <p>No removed threads found for /r/{subreddit}</p>
            : this.state.threads.map(thread => (
              <Post key={thread.id} {...thread} />
            ))
        }
      </React.Fragment>
    )
  }
}

export default connect(Subreddit)
