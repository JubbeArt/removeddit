import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { prettyScore, prettyDate, parse, isRemoved } from '../../utils'
import classNames from 'classnames'

const Comment = (props) => {
  const [isOpen, setIsOpen] = useState(true)
  const commentIsEven = props.depth % 2 === 0
  const commentIsActive = props.id === props.activeComment

  const containerClassName = classNames('comment-container', {
    collapsed: !isOpen,
    'comment-even': commentIsEven,
    'comment-odd': !commentIsEven,
    deleted: props.deleted,
    removed: props.removed
  })

  const commentClassName = classNames('comment', {
    active: commentIsActive
  })

  const notArchived = isRemoved(props.body) && props.removed;
  const innerHTML = notArchived ? '<p>[removed too quickly to be archived]</p>' : parse(props.body)
  const permalink = `/r/${props.subreddit}/comments/${props.link_id}/_/${props.id}/`
  const handleSetActiveComment = (e) => {
    e.stopPropagation()
    props.setActiveComment(props.id)
  }

  const handleIsOpen = (e) => {
    e.preventDefault()
    setIsOpen(!isOpen)
  }

  return (
    <div id={props.id} className={containerClassName} onClick={handleSetActiveComment}>
      <div className={commentClassName}>
        <div className='comment-head' onClick={() => commentIsActive && setIsOpen(!isOpen)}>
          <a href='#' onClick={handleIsOpen} className='author'>[–]</a>
          <span className='space' />
          <a
            href={props.author !== '[deleted]' ? `https://www.reddit.com/user/${props.author}` : undefined}
            className='author comment-author'
          >
            {props.author}
            {props.deleted && ' (deleted by user)'}
          </a>
          <span className='space' />
          {!notArchived && (
            <span className='comment-score'>{prettyScore(props.score)} point{(props.score !== 1) && 's'}</span>
          )}
          <span className='space' />
          <span className='comment-time'>{prettyDate(props.created_utc)}</span>
        </div>
        <div className='comment-body' dangerouslySetInnerHTML={{ __html: innerHTML }} />
        <div className='comment-links'>
          <Link to={permalink}>permalink</Link>
          <a href={`https://www.reddit.com${permalink}`}>reddit</a>
          <a href={`https://snew.github.io${permalink}`}>ceddit</a>
        </div>
      </div>
      {props.replies && (
        <div className='comment-replies'>
          {props.replies.map(comment => (
            <Comment
              key={comment.id}
              {...comment}
              depth={props.depth + 1}
              activeComment={props.activeComment}
              setActiveComment={props.setActiveComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Comment
