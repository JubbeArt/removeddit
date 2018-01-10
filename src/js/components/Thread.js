import React from 'react'

export default class About extends React.Component {
	render () {
		return (
			<div class="thread">
				{this.props.threadPosition &&
				<span class="post-rank">{this.props.threadPosition}</span>
				}
				<div class="thread-score-box">
					<div class="vote upvote"></div>
					<div class="thread-score"><%= Format.prettyScore(thread.score) %></div>
					<div class="vote downvote"></div>
				</div>
			<% 	var url = _.replace(thread.url, "https://www.reddit.com", "https://www.removeddit.com");

				if(_.includes(["self", "default", "image", "nsfw"], thread.thumbnail)) { %>
					<a href="<%= url %>" class="thumbnail thumbnail-<%= thread.thumbnail%>"></a>
			<%	} else {
					var thumbnailWidth = _.defaultTo(thread.thumbnail_width, 140) * 0.5;
					var thumbnailHeight = _.defaultTo(thread.thumbnail_height, 140) * 0.5;
				%>	<a href="<%= url %>">
						<img class="thumbnail" src="<%= thread.thumbnail %>" width="<%= thumbnailWidth %>" height="<%= thumbnailHeight %>">
					</a>
			<%	} %>
				<div class="thread-content">

					<a class="thread-title" href="<%= url %>"><%= thread.title %></a>
			<%	if(!_.isNil(thread.link_flair_text)){ %>
					<span class="link-flair"><%= thread.link_flair_text %></span>
			<%	} %>	
					<span class="domain">(<%= thread.domain %>)</span>
					<div class="thread-info">
						submitted <span class="thread-time"><%= Format.prettyDate(thread.created_utc) %></span> by
						<a class="thread-author author" href="https://www.reddit.com/user/<%= thread.author %>"><%= thread.author %></a>
					<%	if(Reddit.isAll){ %>
						to <a class="subreddit-link author" href="/r/<%= thread.subreddit %>">/r/<%= thread.subreddit %></a>
					<%	} %>		
					</div>
					<div class="total-comments">
						<a class="grey-link" href="<%= thread.permalink %>">
							<b><%= thread.num_comments %> comments</b>
						</a>
						<a class="grey-link" href="https://www.reddit.com<%= thread.permalink %>">
							<b>reddit</b>
						</a>
					</div>
				</div>
			</div>
	)
	}
}