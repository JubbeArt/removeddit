"use strict";

var app = (function(){		
return {
	loadPage: function() {
		Status.loading("Loading thread...");
		var urlData = {id: parseInt(Reddit.threadID, 36)};

		Promise.all([
			Fetch2.get(ElasticSearch.threadURL+_.templates.elasticThread(urlData), "Could not get thread")
			.then(Fetch2.json)
			.then(function(json){
				HTML.main.innerHTML += _.templates.thread({thread: json.hits.hits[0]._source});
				return json;
			})
			.catch(Fetch2.handleError),
			
			Fetch2.get(ElasticSearch.commentURL+_.templates.elasticComments(urlData), "Could not get removed comments")
			.then(Fetch2.json)
			.catch(Fetch2.handleError)
		])
		.then(function(promises){
			var commentData = {
				removedComments: promises[1].hits.total,
				totalComments: promises[0].hits.hits[0]._source.num_comments
			};

			HTML.main.innerHTML += _.templates.threadInfo(commentData);
			Comments.addComments(promises[1]);
			Status.loading("Getting remaining comments...");
		})
		.then(function getRemainingComments() {
			return Fetch2.get(ElasticSearch.commentURL+_.templates.elasticCommentIDs({ids:Comments.missing}), "Could not get remaining comments")
			.then(Fetch2.json)
			.then(function(json){ 
				Comments.addComments(json);
				
				if(Comments.missing.length !== 0) {
					return getRemainingComments();
				}
			});
		})
		.then(function(){	
			// Make sure to get the permalink comment (even if it's not related to removed/deleted stuff)
			if(Comments.isPermalink && !_.includes(Comments.IDs, Comments.getRoot())) {
				var urlData = {ids: [Comments.to10(Comments.getRoot())]};
				return Fetch2.get(ElasticSearch.commentURL+_.templates.elasticCommentIDs(urlData), "Could not find the specific comment asked for")
				.then(Fetch2.json)
				.then(function(json){ 
					Comments.addComments(json);
				});	
			}
		})
		.then(function(){
			HTML.main.innerHTML += '<div id="'+Reddit.threadID+'"></div>';
			Status.loading("Generating comments...");
			Comments.generate();
			Status.success();
		})
		.catch(Fetch2.handleError);
	}
}})();


var Comments = (function() {
return {
	IDs: [], // The comments we found
	lookup: {},
	missing: [],
	isPermalink: (Reddit.permalink !== undefined && Reddit.permalink !== ""),
	
	
	
	addComments: function(json){

		Comments.IDs = _.union(Comments.IDs, _.map(json.hits.hits, function(comment){
			return Comments.to36(comment._id);
		}));

		_.forEach(json.hits.hits, function(comment){
			comment._source.parent_id = _.isNil(comment._source.parent_id) ? Reddit.threadID : Comments.to36(comment._source.parent_id);
			Comments.lookup[Comments.to36(comment._id)] = comment._source;
		});

		Comments.missing = _.reduce(json.hits.hits, function(array, comment){
			if(comment._source.parent_id !== Reddit.threadID && !_.includes(Comments.IDs, comment._source.parent_id)) {
				array.push(Comments.to10(comment._source.parent_id));
			}
			return array;
		}, []);
	},
	
	getRoot: function() {
		if(Reddit.permalink !== undefined && Reddit.permalink !== "") {
			return Reddit.permalink;
		}
	
		return Reddit.threadID;
	},

	generate: function(){
		//console.log("asdf ",_.includes(Comments.ids, "dms36h7"))
		Comments.IDs = _.sortBy(_.uniq(Comments.IDs), function(id) {
			return Comments.lookup[id].score;
		});

		var createdComments = [];

		if(Comments.isPermalink) {
			var urlData = {
				id: Comments.permalink,
				comment: Comments.lookup[Reddit.permalink]
			}
			document.getElementById(Reddit.threadID).innerHTML += _.templates.comment(urlData);
			createdComments.push(Reddit.permalink);
		} else {
			createdComments.push(Reddit.threadID);
		}

		var didSomething;
	
		while(Comments.IDs.length > 0) {
			didSomething = false;
	
			for(var i = Comments.IDs.length - 1; i >= 0; i--) {
				var id = Comments.IDs[i];
				var parentID = Comments.lookup[id].parent_id;
	
				if(_.includes(createdComments, parentID)) {
					document.getElementById(parentID).innerHTML += (_.templates.comment({id:id, comment: Comments.lookup[id]}));
					createdComments.push(id);
					Comments.IDs.splice(i, 1);
					didSomething = true;
				}
			}
	
			// Fail safe (parents missing for the rest of the comments, shouldn't happend but oh well :D)
			if(!didSomething) {
				console.error("Didn't generate all comments correctly");
				break;
			}
		}
	}
};
})();

/*

var ThreadHTML = (function(){
	// I actually haven't found a better way of doing this... 
	// Imgur has image-links with no indication that they are actually images
	var imageHosts = ["i.redd.it", "flickr.com", "i.imgur.com", "imgur.com", "m.imgur.com"];
	
	var createThread = function(data) {
		var thread = data[0].data.children[0].data;
		Comments.setTotalComments(thread.num_comments);
		document.title = thread.title+" : "+thread.subreddit;

		var defaultThumbnails = ["self", "default", "image", "nsfw"];		
		var thumbnail = '<a href="'+thread.permalink+'" class="thumbnail';
		if(thread.thumbnail === "") {
			thumbnail = "";
		} else if(_.includes(defaultThumbnails, thread.thumbnail)) {
			thumbnail += ' thumbnail-'+thread.thumbnail+'"></a>';
		} else {
			thumbnail += '"><img src="'+thread.thumbnail+'" width="'+(thread.thumbnail_width * 0.5)+'" height="'+(thread.thumbnail_height * 0.5)+'"></a>';
		}
		
		var threadDiv = document.createElement("div");
		threadDiv.className = "thread";
		threadDiv.innerHTML  = ' \
			<div class="thread-score-box"> \
				<div class="vote upvote"></div> \
				<div class="thread-score">'+Format.prettyScore(thread.score)+'</div> \
				<div class="vote downvote"></div> \
			</div>'+
			thumbnail+
			'<div class="thread-content"> \
				'+(thread.link_flair_text !== null ? '<span class="link-flair">'+thread.link_flair_text+'</span>' : '') +
				'<a class="thread-title" href="'+thread.url+'">'+thread.title+'</a> \
				<span class="domain">('+thread.domain+')</span> \
				<div class="thread-info"> \
					submitted <span class="thread-time">'+Format.prettyDate(thread.created_utc)+'</span> by \
					<a class="thread-author author" href="https://www.reddit.com/user/'+thread.author+'">'+thread.author+'</a> to \
					<a class="subreddit-link author" href="/r/'+thread.subreddit+'">/r/'+thread.subreddit+'</a> \
				</div>' +
				(thread.selftext !== '' ? '<div class="thread-selftext user-text">'+Format.parse(thread.selftext)+'</div>':'') +
				'<div class="total-comments"> \
					<a class="grey-link" href="'+thread.permalink+'"><b>'+thread.num_comments+' comments</b></a> \
					<a class="grey-link" href="https://www.reddit.com'+thread.permalink+'"><b>reddit</b></a> \
					</div>' +
				(thread.media !== null ? HTML.parse(thread.media_embed.content) : '') +
				(_.includes(imageHosts, thread.domain) && _.has(thread, "preview") ? '<a href="'+thread.url+'"><img class="thread-image" src="'+thread.preview.images[0].source.url+'"></a>' : '') +
			'</div> \
		';
		mainDiv.appendChild(threadDiv);
		return data;
	};

	

})();*/

if(isSupported) {
	app.loadPage();
}