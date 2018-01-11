import React from 'react'
import {prettyScore, statusImages, redditThumbnails} from 'utils'

export default class Thread extends React.Component {
	constructor() {
		super()

		this.state = {
			url: '',
			thumbnailWidth: 70,
			thumbnailHeight: 70,
			thumbnail: '',
			position: 0,
			score: 0
		}
	}

	handleStateChange(text, image) {
		this.props.onStateChange(text, image)
	}

	render () {
		const url = this.props.url.replace('reddit.com', 'removeddit.com')
		let thumbnail
		const thumbnailWidth = this.props.thread.thumbnail_width ? this.props.thread.thumbnail_width * 0.5 : 70
		const thumbnailHeight = this.props.thread.thumbnail_height ? this.props.thread.thumbnail_height * 0.5 : 70

		if(['self', 'default', 'image', 'nsfw'].includes(this.props.thread.thumbnail)) {
			thumbnail = <a href={url} className='thumbnail thumbnail-<%= thread.thumbnail%>'></a>
		} else {
			thumbnail = (
				<a href={url}>
					<img className='thumbnail' src={this.props.thread.thumbnail} width='<%= thumbnailWidth %>' height='<%= thumbnailHeight %>'/>
				</a>
			)
		}

		return (
			<div className='thread'>
				{this.props.threadPosition &&
				<span className='post-rank'>{this.props.threadPosition}</span>}
				<div className='thread-score-box'>
					<div className='vote upvote'></div>
					<div className='thread-score'>{prettyScore(this.props.thread.score)}</div>
					<div className='vote downvote'></div>
				</div>
				{thumbnail}
				<div className='thread-content'>

					<a className='thread-title' href={this.props.url}>{this.props.thread.title}</a>
					{thread.link_flair_text && 
					<span className='link-flair'>{this.props.thread.link_flair_text}</span>}
					<span className='domain'>({this.props.thread.domain})</span>
					<div className='thread-info'>
						submitted <span className='thread-time'>{prettyDate(this.props.thread.created_utc)}</span> by
						<a className='thread-author author' href={`https://www.reddit.com/user/${this.props.thread.author}`}>{this.props.thread.author}</a>
					{/* <%	if(Reddit.isAll){ %>
						to <a className='subreddit-link author' href='/r/<%= thread.subreddit %>'>/r/<%= thread.subreddit %></a>
					<%	} %>		 */}
					</div>
					<div className='total-comments'>
						<a className='grey-link' href='<%= thread.permalink %>'>
							<b>{this.props.thread.num_comments} comments</b>
						</a>
						<a className='grey-link' href={`https://www.reddit.com${this.props.thread.permalink}`}>
							<b>reddit</b>
						</a>
					</div>
				</div>
			</div>
		)
	}
}