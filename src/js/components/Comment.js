import React from 'react'
import { prettyScore, prettyDate, parse } from 'utils'

export default (props) => {
  let commentStyle = 'comment comment-'

  if (props.removed) {
    commentStyle += 'removed'
  } else if (props.deleted) {
    commentStyle += 'deleted'
  } else {
    commentStyle += props.depth % 2 === 0 ? 'even' : 'odd'
  }

  const innerHTML = (props.body === '[removed]' && props.removed) ? '<p>[removed too quickly to be archived]</p>' : parse(props.body)
  const permalink = `/r/${props.subreddit}/comments/${props.threadID}/_/${props.id}/`

  return (
    <div id={props.id} className={commentStyle}>
      <div className='comment-head'>
        <button onClick={false} className='author'>[–]</button>
        <a href={`https://www.reddit.com/user/${props.author}`} className='author comment-author'>
          {props.author}
          {props.deleted && ' (deleted by user)'}
        </a>
        <span className='comment-score'>{prettyScore(props.score)} point{(props.score !== 1) && 's'}</span>
        <span className='comment-time'>{prettyDate(props.created_utc)}</span>
      </div>
      <div className='comment-body' dangerouslySetInnerHTML={{ __html: innerHTML }} />
      <div className='comment-links'>
        <a href={permalink}>permalink</a>
        <a href={`https://www.reddit.com${permalink}`}>reddit</a>
        <a href={`https://snew.github.io${permalink}`}>ceddit</a>
      </div>
    </div>
  )
}
