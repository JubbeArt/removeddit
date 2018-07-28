import React from 'react'
import { Link } from 'react-router-dom'
import { prettyScore, prettyDate, parse, redditThumbnails, isDeleted } from '../../utils'

export default (props) => {
  if (!props.title) {
    return <div />
  }

  const url = props.url.replace('https://www.reddit.com', '')
  const userLink = isDeleted(props.author) ? undefined : `https://www.reddit.com/user/${props.author}`

  let thumbnail
  const thumbnailWidth = props.thumbnail_width ? props.thumbnail_width * 0.5 : 70
  const thumbnailHeight = props.thumbnail_height ? props.thumbnail_height * 0.5 : 70

  if (redditThumbnails.includes(props.thumbnail)) {
    thumbnail = <a href={url} className={`thumbnail thumbnail-${props.thumbnail}`} />
  } else if (props.thumbnail !== '') {
    thumbnail = (
      <a href={url}>
        <img className='thumbnail' src={props.thumbnail} width={thumbnailWidth} height={thumbnailHeight} alt='Thumbnail' />
      </a>
    )
  }

  return (
    <div className={`thread ${props.removed && 'removed'}`}>
      {props.position &&
      <span className='post-rank'>{props.position}</span>}
      <div className='thread-score-box'>
        <div className='vote upvote' />
        <div className='thread-score'>{prettyScore(props.score)}</div>
        <div className='vote downvote' />
      </div>
      {thumbnail}
      <div className='thread-content'>
        <a className='thread-title' href={url}>{props.title}</a>
        {
          props.link_flair_text &&
          <span className='link-flair'>{props.link_flair_text}</span>
        }
        <span className='domain'>({props.domain})</span>
        <div className='thread-info'>
          submitted <span className='thread-time'>{prettyDate(props.created_utc)}</span> by&nbsp;
          <a className='thread-author author' href={userLink}>{props.author}</a>
          &nbsp;to <Link className='subreddit-link author' to={`/r/${props.subreddit}`}>/r/{props.subreddit}</Link>
        </div>
        {props.selftext &&
        <div className='thread-selftext user-text' dangerouslySetInnerHTML={{ __html: parse(props.selftext) }} />}
        <div className='total-comments'>
          <Link className='grey-link' to={props.permalink}><b>{props.num_comments} comments</b></Link>&nbsp;
          <a className='grey-link' href={`https://www.reddit.com${props.permalink}`}><b>reddit</b></a>&nbsp;
          <a className='grey-link' href={`https://snew.github.io${props.permalink}`}><b>ceddit</b></a>
        </div>
      </div>
    </div>
  )
}
