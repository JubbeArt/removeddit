import React from 'react'
import { Link } from 'react-router-dom'
import { prettyScore, prettyDate, parse } from '../../utils'

const Comment = (props) => {
  let commentStyle = 'comment '

  if (props.removed) {
    commentStyle += 'removed'
  } else if (props.deleted) {
    commentStyle += 'deleted'
  } else {
    commentStyle += props.depth % 2 === 0 ? 'comment-even' : 'comment-odd'
  }

  const innerHTML = (props.body === '[removed]' && props.removed) ? '<p>[removed too quickly to be archived]</p>' : parse(props.body)
  const permalink = `/r/${props.subreddit}/comments/${props.link_id}/_/${props.id}/`

  return (
    <div id={props.id} className={commentStyle}>
      <div className='comment-head'>
        <a href='#' onClick={() => false} className='author'>[–]</a>
        <span className='space' />
        <a
          href={props.author !== '[deleted]' ? `https://www.reddit.com/user/${props.author}` : undefined}
          className='author comment-author'
        >
          {props.author}
          {props.deleted && ' (deleted by user)'}
        </a>
        <span className='space' />
        <span className='comment-score'>{prettyScore(props.score)} point{(props.score !== 1) && 's'}</span>
        <span className='space' />
        <span className='comment-time'>{prettyDate(props.created_utc)}</span>
      </div>
      <div className='comment-body' dangerouslySetInnerHTML={{ __html: innerHTML }} />
      <div className='comment-links'>
        <Link to={permalink}>permalink</Link>
        <a href={`https://www.reddit.com${permalink}`}>reddit</a>
        <a href={`https://snew.github.io${permalink}`}>ceddit</a>
      </div>
      <div>
        {props.replies.map(comment => (
          <Comment
            key={comment.id}
            {...comment}
            depth={props.depth + 1}
          />
        ))}
      </div>
    </div>
  )
}

export default Comment
