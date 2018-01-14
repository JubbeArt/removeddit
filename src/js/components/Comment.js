// <%
// var isRemoved = _.has(comment,"removed");
// var isDeleted = _.has(comment,"deleted");

// var commentCss = "comment comment-" + (isRemoved ? "removed" : (isDeleted ? "deleted" : (comment.depth % 2 == 0 ? "even" : "odd")));
// %>

// <div id="<%= id %>" class="<%= commentCss %>">
// 	<div class="comment-head">
// 		<a href="javascript:void(0)" class="author">[–]</a>
// 		<a href="https://www.reddit.com/user/<%= comment.author %>" class="author comment-author">
// 			<%= comment.author+(isDeleted ? " (deleted by user)" : "") %>
// 		</a>
// 		<span class="comment-score"><%= Format.prettyScore(comment.score) %> point<%= ((comment.score == 1) ? "": "s") %></span>
// 		<span class="comment-time"><%= Format.prettyDate(comment.created_utc) %></span>
// 	</div>
// 	<div class="comment-body">
// 		<%= (comment.body === "[removed]" && isRemoved ? "<p>[likely removed by automoderator]</p>" : Format.parse(comment.body)) %>
// 	</div>
// 	<div class="comment-links">
// 		<a href="/r/<%= Reddit.subreddit %>/comments/<%= Reddit.threadID %>/_/<%= id %>/">permalink</a>
// 		<a href="https://www.reddit.com/r/<%= Reddit.subreddit %>/comments/<%= Reddit.threadID %>/_/<%= id %>/">reddit</a>
// 	</div>
// </div>

