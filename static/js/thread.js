"use strict";

var app = (function(){		
return {
	loadPage: function() {
		// Just fucking crach if the user is retarded
		if(_.isUndefined(Reddit.threadID) || _.isUndefined(Reddit.subreddit)) {
			Status.error("Missing necessary parts of the URL");
			return;
		}
	
		Status.loading("Loading thread...");
		Reddit.fetchToken()
		.then(function(){
			return Promise.all([
				fetch(URLs.thread, Reddit.init)
				.then(Fetch2.json)
				.then(ThreadHTML.createThread)
				.catch(function(error) {
					return Promise.reject("Could not get thread from Reddit");
				}), 

				fetch(URLs.pushshiftIDs)
				.then(Fetch2.json)
				.then(_.property("data"))
				.catch(function(error) {
					return Promise.reject("Could not get removed comment IDs");
				}), 
			])
		})
		.then(function(results) {
			var thread = results[0];
			Comments.allIDs = results[1];

			Status.loading("Loading comments from reddit...");
			HandleIDs.normal(thread);
			return HandleIDs.morechildren()
			.catch(function(error){
				return Promise.reject("Could not get comments from Reddit (moreChildren)");
			});		
		})
		.then(function(){
			return Promise.all(_.map(_.uniq(Comments.countinuethread), function(id) { 
				return fetch(URLs.thread+"/_/"+id.split("_")[1], Reddit.init)
				.then(Fetch2.json)
				.catch(function(error){ return Promise.reject("Could not get comments from Reddit (continueThisThread)") })
			}))
			.catch(function(error){
				return Promise.reject("Could not get comments from Reddit (continueThisThread)");
			});			
		})
		.then(function(smallerThreads){
			_.forEach(smallerThreads, function(thread){
				HandleIDs.normal(thread);
			})
			Status.loading("Getting removed comments...");
			HandleIDs.removed();
			ThreadHTML.createCommentInfo(Comments.removed.length);
			return Fetch2.multiple(URLs.format(URLs.pushshiftComments, Comments.removed), null, "data")
			.catch(function(error){
				return Promise.reject("Could not get removed comments");
			});			
		})
		.then(function(removedComments){
			Status.loading("Generating comments...");
			return Comments.generate(removedComments);
		})
		.then(function(){
			Status.success();
		})
		.catch(function(error) {
			if(_.includes(_.lowerCase(error), "error")) {
				Status.error(error);
			} else {
				Status.error("Error: "+error);
			}
		});
	}
}})();

// ------------------------------------------------------------------------------
// ----------------------- Store and genrates comments --------------------------
// ------------------------------------------------------------------------------
var Comments = (function() {
	var totalComments;
	var lookup = {};
	var toBeCreated = [];

	var getParentComments = function(toLookup){	
		var newCommentsToLookup = [];
		var commentsToFetch = [];

		_.forEach(toLookup, function(id){
			var parentID = lookup[id].parent_id.split("_")[1];
	
			if(parentID === Reddit.threadID) {} // Has no parent (is parent of thread)
			else if(_.includes(Comments.toBeCreated, parentID)) {} // Parent already exists, do nothing
			else if(_.includes(newCommentsToLookup, parentID)) {} // Parent already exists (this iteration)
			else if(_.has(lookup, parentID)) {
					newCommentsToLookup.push(parentID);
			} else{
				commentsToFetch.push(parentID);
			}
	
			Comments.toBeCreated.push(id);
		});
	
		return new Promise(function(resolve, reject){	
			if(_.uniq(commentsToFetch).length !== 0) {
				fetch(URLs.singleComments + _.join(_.map(_.uniq(commentsToFetch),function(comments){
					return "t1_" + comments;
				})), Reddit.init)
				.then(Fetch2.json)
				.then(function(json){
					_.forEach(json.data.children, function(comment) {
						lookup[comment.data.id] = comment.data;
						newCommentsToLookup.push(comment.data.id);
					});
				})
				.then(function(){
					resolve();
				});
				
			} else {
				resolve();		
			}
		})
		.then(function(){
			if(newCommentsToLookup.length !== 0) {
				return getParentComments(newCommentsToLookup)
			}
		});
		
	};

return {
	ids: [], // The comments we found
	morechildren: [],
	countinuethread: [],
	
	allIDs: [], // All the comments that we were suppose to find
	removed: [],
	deleted: [],
	toBeCreated: toBeCreated,
	lookup: lookup,

	getTotalComments: function() { return totalComments; },
	setTotalComments: function(total) { totalComments = total; },

	getRoot: function() {
		if(Reddit.permalink !== undefined && Reddit.permalink === "") {
			return Reddit.threadID;
		}

		if(Reddit.permalink === undefined) {
			return Reddit.threadID;
		}

		if(_.has(Comments.lookup, Reddit.permalink)) {
			return Comments.lookup[Reddit.permalink].parent_id.split("_")[1];
		}			
		return "";
	},
	generate: function(removedComments) {
		removedComments.forEach(function(comment){
			if(_.includes(Comments.deleted, comment.id)) {
				comment["deleted"] = true;
			} else {
				comment["removed"] = true;	
			}
			
			Comments.lookup[comment.id] = comment;
		});
	
		Comments.removed = _.map(removedComments, function(comment){
			return comment.id;
		});
				
		return getParentComments(Comments.removed)
		.then(function(){	
			ThreadHTML.createCommentSection();	
			ThreadHTML.createComments();
		})
	}
}})();



// ------------------------------------------------------------------------------
// ----------------- Handle comments from different requests --------------------
// ------------------------------------------------------------------------------
var HandleIDs = (function(){
	var normal = function(thread){
		return _.flatten(_.map(thread[1].data.children, Extract.normal))
	};

	var morechildren = function(){
		return Promise.all(_.map(_.uniq(Comments.morechildren), function(idArray){				
			return Fetch2.multiple(URLs.format(URLs.moreChildren, idArray), Reddit.init);
		}))
		.then(function(responseArrays){
			Comments.morechildren.length = 0;
			_.forEach(responseArrays, function(responseArray){
				_.forEach(responseArray, function(response){
					_.forEach(response.jquery[10][3][0], function(comment){
						Extract.normal(comment);
					})
				});
			});
		}).then(function(){
			if(Comments.morechildren.length !== 0) {
				return morechildren();
			}	
		});
	};

	var removed = function(){
		Comments.removed = _.difference(Comments.allIDs, Comments.ids);

		Comments.ids.forEach(function(id){
			if(! _.has(Comments.lookup, id)) {
				return;
			}
	
			if(Comments.lookup[id].body === "[removed]") {
				Comments.removed.push(id);
			} else if (Comments.lookup[id].body === "[deleted]"){
				Comments.removed.push(id);
				Comments.deleted.push(id);
			}
		});

		Comments.removed = _.uniq(Comments.removed);
	};

	return {
		normal: normal,
		morechildren: morechildren,
		removed: removed
	};
})();


// ------------------------------------------------------------------------------
// ----------------------- Extract ID from comments -----------------------------
// ------------------------------------------------------------------------------
var Extract = (function(){
	var normal = function(comment){
		var data = comment.data;
		
		if(comment.kind == "more") { // "Show more"-comment			
			if(data.id === "_") {	// = "continue this thread" comment
				Comments.countinuethread.push(data.parent_id);
			} else if(data.children.length < data.count){ // "Load more"-comment (that is missing some of its children)
				Comments.morechildren.push(data.children);
			}
			Comments.ids.push.apply(Comments.ids, data.children);
		} else { // Normal comment
			if(data.replies) {
				data.replies.data.children.forEach(function(child){
					normal(child);
				});
				delete data.replies;
			}
			
			Comments.ids.push(data.id);
			Comments.lookup[data.id] = data;
		}
	};
	
	return {
		normal: normal
	};	
})();


// ------------------------------------------------------------------------------
// ---------------------------- Generating HTML ---------------------------------
// ------------------------------------------------------------------------------

var ThreadHTML = (function(){
	var mainDiv = document.getElementById("main");
	// I actually haven't found a better way of doing this... 
	// Imgur has image-links with no indication that they are actually images
	var imageHosts = ["i.redd.it", "flickr.com", "i.imgur.com", "imgur.com", "m.imgur.com"];
	
	var createThread = function(data) {
		var thread = data[0].data.children[0].data;
		Comments.setTotalComments(thread.num_comments);
		document.title = thread.title+" : "+thread.subreddit;
		
		var threadDiv = document.createElement("div");
		threadDiv.innerHTML  = ' \
			<div id="thread"> \
				<div id="thread-score-box"> \
					<div class="vote upvote"></div> \
					<div id="thread-score">'+Format.prettyScore(thread.score)+'</div> \
					<div class="vote downvote"></div> \
				</div> \
				<div id="thumbnail"></div> \
				<div id="thread-content"> \
					'+(thread.link_flair_text !== null ? '<span class="link-flair">'+thread.link_flair_text+'</span>' : '') +
					'<a id="thread-title" href="'+thread.url+'">'+thread.title+'</a> \
					<span id="domain">('+thread.domain+')</span> \
					<div id="thread-info"> \
						submitted <span id="thread-time">'+Format.prettyDate(thread.created_utc)+'</span> by \
						<a id="thread-author" class="user-link" href="https://www.reddit.com/user/'+thread.author+'">'+thread.author+'</a> to \
						<a id="subreddit-link" class="user-link" href="https://reddit.com/r/'+thread.subreddit+'">/r/'+thread.subreddit+'</a> \
					</div>' +
					(thread.selftext !== '' ? '<div id="thread-selftext" class="user-text">'+Format.parse(thread.selftext)+'</div>':'') +
					'<div id="total-comments"><a class="grey-link" href="https://www.reddit.com'+thread.permalink+'"><b>'+thread.num_comments+' comments</b></a></div>' +
					(thread.media !== null ? HTML.parse(thread.media_embed.content) : '') +
					(_.includes(imageHosts, thread.domain) && _.has(thread, "preview") ? '<a href="'+thread.url+'"><img id="thread-image" src="'+thread.preview.images[0].source.url+'"></a>' : '') +
				'</div> \
			</div> \
		';
		mainDiv.appendChild(threadDiv);
		return data;
	};

	var createCommentInfo = function(totalRemovedComments){
		var div = document.createElement("div");
		div.innerHTML = ' \
			<div id="comment-info"> \
				removed comments: '+totalRemovedComments+'/'+Comments.getTotalComments()+' ('+(100 * totalRemovedComments / Comments.getTotalComments()).toFixed(1)+'%) \
			</div> \
			<div id="comment-sort">sorted by: top</div> \
		';
		
		mainDiv.appendChild(div);
	};

	var createCommentSection = function(){
		var div = document.createElement("div");
		div.id = Comments.getRoot();
		mainDiv.appendChild(div);		
	};

	var createComments = function(){
		var commentsToCreate = _.sortBy(_.uniq(Comments.toBeCreated), function(id) {
			return Comments.lookup[id].score;
		});

		var createdComments = [Comments.getRoot()];
		var didSomething = false;
	
		while(commentsToCreate.length > 0) {
			didSomething = false;
	
			for(var i = commentsToCreate.length - 1; i >= 0; i--) {
				var id = commentsToCreate[i];
				var parentID = Comments.lookup[id].parent_id.split("_")[1];
	
				if(_.includes(createdComments, parentID)) {
					document.getElementById(parentID).appendChild(createComment(Comments.lookup[id]));
					createdComments.push(id);
					commentsToCreate.splice(i, 1);
					didSomething = true;
				}
			}
	
			// Fail safe (parents missing for the rest of the comments, shouldn't happend but oh well :D)
			if(!didSomething) {
				console.error("Didn't generate all comments correctly");
				break;
			}
		}
	};

	var createComment = function(comment){
		var isRemoved = _.has(comment,"removed");
		var isDeleted = _.has(comment,"deleted");

		// Sorry
		var commentCss = "comment-" + (isRemoved ? "removed" : (isDeleted ? "deleted" : (comment.depth % 2 == 0 ? "even" : "odd")));

		var commentDiv = document.createElement("div");
		commentDiv.id = comment.id;
		commentDiv.className = "comment " + commentCss;
		commentDiv.innerHTML = ' \
			<div class="comment-head"> \
				<a href="javascript:void(0)" class="user-link">[–]</a> \
				<a href="https://www.reddit.com/user/'+comment.author+'" class="user-link comment-author">'+comment.author+(isDeleted ? " (deleted by user)" : "")+'</a> \
				<span class="comment-score">'+Format.prettyScore(comment.score)+' point'+((comment.score == 1) ? '': 's')+'</span> \
				<span class="comment-time">'+Format.prettyDate(comment.created_utc)+'</span> \
			</div> \
			<div class="comment-body">'+(comment.body === "[removed]" && isRemoved ? "<p>[likely removed by automoderator]</p>" : Format.parse(comment.body))+'</div> \
			<div class="comment-links"> \
				<a href="/r/'+Reddit.subreddit+'/comments/'+Reddit.threadID+'/_/'+comment.id+'/">permalink</a> \
		</div>';

		return commentDiv;
	};
	
	return {
		createThread: createThread,
		createCommentInfo: createCommentInfo,
		createCommentSection: createCommentSection,
		createComments: createComments
	}
})();

if(isSupported) {
	app.loadPage();
}