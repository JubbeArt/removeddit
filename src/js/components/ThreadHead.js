import React from 'react'
import {prettyScore, prettyDate, parse, redditThumbnails} from 'utils'

export default (props) => {
	if(!props.title) {
		return <div></div>
	}

	const url = props.url.replace('https://www.reddit.com', '')
	const userLink = props.author !== '[deleted]' ? `https://www.reddit.com/user/${props.author}` : ''

	let thumbnail
	const thumbnailWidth = props.thumbnail_width ? props.thumbnail_width * 0.5 : 70
	const thumbnailHeight = props.thumbnail_height ? props.thumbnail_height * 0.5 : 70

	if(redditThumbnails.includes(props.thumbnail)) {
		thumbnail = <a href={url} className={`thumbnail thumbnail-${props.thumbnail}`}></a>
	} else if(props.thumbnail !== ''){
		thumbnail = (
			<a href={url}>
				<img className='thumbnail' src={props.thumbnail} width={thumbnailWidth} height={thumbnailHeight}/>
			</a>
		)
	}

	return (
		<div className='thread'>
			{props.position &&
			<span className='post-rank'>{props.position}</span>}
			<div className='thread-score-box'>
				<div className='vote upvote'></div>
				<div className='thread-score'>{prettyScore(props.score)}</div>
				<div className='vote downvote'></div>
			</div>
			{thumbnail}
			<div className='thread-content'>
				<a className='thread-title' href={url}>{props.title}</a>
				{props.link_flair_text && 
				<span className='link-flair'>{props.link_flair_text}</span>}
				<span className='domain'>({props.domain})</span>
				<div className='thread-info'>
					submitted <span className='thread-time'>{prettyDate(props.created_utc)}</span> by&nbsp;			
					<a className='thread-author author' href={userLink}>{props.author}</a>
					&nbsp;to <a className='subreddit-link author' href={`/r/${props.subreddit}`}>/r/{props.subreddit}</a>
				</div>
				{props.selftext &&
				<div className='thread-selftext user-text' dangerouslySetInnerHTML={{__html: parse(props.selftext)}}></div>}
				<div className='total-comments'>
					<a className='grey-link' href={props.permalink}>
						<b>{props.num_comments} comments</b>
					</a>&nbsp;
					<a className='grey-link' href={`https://www.reddit.com${props.permalink}`}>
						<b>reddit</b>
					</a>&nbsp;
					<a className='grey-link' href={`https://snew.github.io${props.permalink}`}>
						<b>ceddit</b>
					</a>
				</div>
			</div>
		</div>
	)
}