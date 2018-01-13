import React from 'react'
import {prettyScore, statusImages, redditThumbnails} from 'utils'

export default class Thread extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			url: '',
			thumbnailWidth: 70,
			thumbnailHeight: 70,
			thumbnail: '',
			position: 0,
			score: 0
		}
	}

	render () {
		// const url = this.props.url.replace('reddit.com', 'removeddit.com')
		// let thumbnail
		// const thumbnailWidth = this.state.thumbnail_width ? this.state.thumbnail_width * 0.5 : 70
		// const thumbnailHeight = this.state.thumbnail_height ? this.state.thumbnail_height * 0.5 : 70

		// if(redditThumbnails.includes(this.state.thumbnail)) {
		// 	thumbnail = <a href={url} className='thumbnail thumbnail-${this.props..thumbnail}'></a>
		// } else {
		// 	thumbnail = (
		// 		<a href={url}>
		// 			<img className='thumbnail' src={this.state.thumbnail} width='<%= thumbnailWidth %>' height='<%= thumbnailHeight %>'/>
		// 		</a>
		// 	)
		// }

		return (
			<h1>Lol</h1>
			// <div className='thread'>
			// 	{this.state.position &&
			// 	<span className='post-rank'>{this.state.position}</span>}
			// 	<div className='thread-score-box'>
			// 		<div className='vote upvote'></div>
			// 		<div className='thread-score'>{prettyScore(this.state.score)}</div>
			// 		<div className='vote downvote'></div>
			// 	</div>
			// 	{thumbnail}
			// 	<div className='thread-content'>

			// 		<a className='thread-title' href={this.props.url}>{this.state.title}</a>
			// 		{thread.link_flair_text && 
			// 		<span className='link-flair'>{this.state.link_flair_text}</span>}
			// 		<span className='domain'>({this.state.domain})</span>
			// 		<div className='thread-info'>
			// 			submitted <span className='thread-time'>{prettyDate(this.state.created_utc)}</span> by
			// 			<a className='thread-author author' href={`https://www.reddit.com/user/${this.state.author}`}>{this.state.author}</a>
			// 		{/* <%	if(Reddit.isAll){ %>
			// 			to <a className='subreddit-link author' href='/r/<%= thread.subreddit %>'>/r/<%= thread.subreddit %></a>
			// 		<%	} %>		 */}
			// 		</div>
			// 		<div className='total-comments'>
			// 			<a className='grey-link' href='<%= thread.permalink %>'>
			// 				<b>{this.state.num_comments} comments</b>
			// 			</a>
			// 			<a className='grey-link' href={`https://www.reddit.com${this.state.permalink}`}>
			// 				<b>reddit</b>
			// 			</a>
			// 		</div>
			// 	</div>
			// </div>
		)
	}
}