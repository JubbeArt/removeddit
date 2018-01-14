import React from 'react'
import { prettyScore, prettyDate, parse } from 'utils'

export default (props) => {
	const commentCss = 'comment comment-' + (props.removed ? 'removed' : (props.deleted ? 'deleted' : (props.depth % 2 == 0 ? 'even' : 'odd')));
	const innerHTML = (props.body === '[removed]' && props.removed) ? '<p>[removed too quickly to be archived]</p>' : parse(comment.body)
	const permalink = `/r/${props.subreddit}/comments/${props.threadID}/_/${props.id}/`

	return (
		<div id={props.id} className={commentCss}>
			<div className='comment-head'>
				<a href='javascript:void(0)' className='author'>[–]</a>
				<a href={`https://www.reddit.com/user/${props.author}`} className='author comment-author'>
					{props.author}
					{props.deleted && ' (deleted by user)'}
				</a>
				<span className='comment-score'>{prettyScore(props.score)} point{(comment.score !== 1) && 's'}</span>
				<span className='comment-time'>{prettyDate(props.created_utc)}</span>
			</div>
			<div className='comment-body' dangerouslySetInnerHTML={{__html: innerHTML}}></div>
			<div className='comment-links'>
				<a href={permalink}>permalink</a>
				<a href={`https://www.reddit.com${permalink}`}>reddit</a>
				<a href={`https://snew.github.io${permalink}`}>ceddit</a>
			</div>
		</div>
	)
}