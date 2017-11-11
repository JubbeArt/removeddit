"use strict";

var app = (function(){
return {
	loadPage: function() {
		Status.loading("Loading subreddit...");
		Vars.loadTime();
		Vars.loadPage();

		if(Vars.isAll) {
			document.title = 'all subreddits';
		} else {
			document.title = Reddit.subreddit;
		}
		
		var timeDifference = Time.difference(Time.toUTC(Vars.getTime()));
		SubredditHTML.createInfo(Reddit.subreddit, Vars.getTime());

		Reddit.fetchToken()
		.then(function(){
			return fetch(ElasticSearch.subreddit(Reddit.subreddit, timeDifference, Vars.getPage()))
			.catch(function(error){
				return Promise.reject("Could not get removed posts");
			});
		})
		.then(function(response){
			if(response.ok) {
				return response;
			} else {
				return Promise.reject("Could not get removed posts");
			}
		})
		.then(Fetch2.json)
		.then(function(json){
			var sourceArray = json.hits.hits;
			var pageNr = (Vars.getPage() - 1) * 25 + 1;
			for(var i = 0, len = sourceArray.length; i < len; i++) { 
				SubredditHTML.createThread(sourceArray[i]._source, pageNr+i);	
			}

			SubredditHTML.createPagination(json.hits.total);
			Status.success();		
		})
		.catch(function(error) {
			if(_.includes(_.toLower(error), "error")) {
				Status.error(error);
			} else {
				Status.error("Error: "+error);
			}
		});
	}
};
})();

var Vars = (function(){
	var time;
	var page;

return {
	isAll: _.toLower(Reddit.subreddit) === 'all',
	loadTime: function(){
		var tmpTime = _.defaultTo(GetVars.get("t"), Cookies.get("t"));
		
		if(Vars.isAll) {
			time = _.defaultTo(tmpTime, "12hour");
		} else {
			time = _.defaultTo(tmpTime, "day");
		}
	},
	loadPage: function() {
		var tmpPage = _.defaultTo(GetVars.get("page"), "1");

		if(tmpPage === "") {
			page = 1;
		} else {
			page = _.parseInt(tmpPage);
		}
	},
	setTime: function(newTime) {
		time = newTime;
	},
	setPage: function(newPage) {
		page = newPage;
	},
	getTime: function(){
		return time;
	},
	getPage: function(){
		return page;
	}
};
})();


var ElasticSearch = (function(){
return {
	subreddit: function(subreddit, time, page){
		var condition = '[{"term":{"subreddit":"'+_.toLower(subreddit)+'"}},'+
		'{"range":{"created_utc":{"gt":'+time+'}}}]';

		if(Vars.isAll) {
			condition = '{"range":{"created_utc":{"gt":'+time+'}}}';
		}

		return URLs.elasticThreads+'{'+
		'"query":{'+
			'"bool":{'+
				'"must":'+condition+
			'}'+
		'},'+
		'"_source":["author","url","subreddit","link_flair_text","score","title","created_utc","selftext","num_comments","domain","permalink","id","thumbnail","thumbnail_height","thumbnail_width"],'+
		'"sort":[{"score":"desc"}],'+
		'"from":'+(page-1)*25+','+
		'"size":25}';
	}	
}
})();

var SubredditHTML = (function(){
	var mainDiv = document.getElementById("main");
return {	
	createThread: function(thread, postRank) {	
		var threadDiv = document.createElement("div");
		threadDiv.className = "thread";
		var threadLink = thread.url;

		if(_.has(thread, 'selftext')) {
			if(thread.selftext !== "") {
				threadLink = thread.permalink;
			}
		}
		var defaultThumbnails = ["self", "default", "image", "nsfw"];		
		var thumbnail = '<a href="'+threadLink+'"';
		
		if(_.includes(defaultThumbnails, thread.thumbnail)) {
			thumbnail += ' class="thumbnail thumbnail-'+thread.thumbnail+'"></a>';
		} else {
			var thumbnailWidth = _.defaultTo(thread.thumbnail_width, 140);
			var thumbnailHeight = _.defaultTo(thread.thumbnail_height, 140);

			thumbnail += '"><img class="thumbnail" src="'+thread.thumbnail+'" width="'+(thumbnailWidth*0.5)+'" height="'+(thumbnailHeight*0.5)+'"></a>';
		}

		threadDiv.innerHTML  = ' \
			<span class="post-rank">'+postRank+'</span> \
			<div class="thread-score-box"> \
				<div class="vote upvote"></div> \
				<div class="thread-score">'+Format.prettyScore(thread.score)+'</div> \
				<div class="vote downvote"></div> \
			</div>'+
			thumbnail+
			'<div class="thread-content"> \
				'+(! _.isNil(thread.link_flair_text) ? '<span class="link-flair">'+thread.link_flair_text+'</span>' : '') +
				'<a class="thread-title" href="'+threadLink+'">'+thread.title+'</a> \
				<span class="domain">('+thread.domain+')</span> \
				<div class="thread-info"> \
					submitted <span class="thread-time">'+Format.prettyDate(thread.created_utc)+'</span> by \
					<a class="thread-author author" href="https://www.reddit.com/user/'+thread.author+'">'+thread.author+'</a> '+
					((_.toLower(Reddit.subreddit) === 'all') ? 'to <a class="subreddit-link author" href="/r/'+thread.subreddit+'">/r/'+thread.subreddit+'</a>':'')+
				'</div> \
				<div class="total-comments"> \
					<a class="grey-link" href="'+thread.permalink+'"><b>'+thread.num_comments+' comments</b></a> \
					<a class="grey-link" href="https://www.reddit.com'+thread.permalink+'"><b>reddit</b></a> \
					</div> \
			</div> \
		';
		mainDiv.appendChild(threadDiv);
	},

	createInfo: function(subreddit, time) {
		var infoDiv = document.createElement("div");
		infoDiv.className = "subreddit-info";
		infoDiv.innerHTML = 'top post of <a href="https://www.reddit.com/r/'+subreddit+'">/r/'+subreddit+'</a> from:'; 
		

		var values = ["hour", "12hour", "day", "week", "month", "6month", "year", "all"];
		var display = ["past hour", "past 12 hours", "past day", "past week", "past month", "past 6 months", "past year", "all time"];
		var options = "";

		for(var i = 0, len = values.length; i < len; i++) {
			options += '<option value="'+values[i]+'"' + ((values[i] === time) ? " selected" : '')+'>'+display[i]+'</option>';
		}

		var select = document.createElement("select");
		select.innerHTML = options;
		select.addEventListener("change", function(event) {
			Cookies.set('t', select.value, { expires: 365 });
			document.location.href = document.location.href.split("?")[0] + "?t=" + select.value;
		});
		infoDiv.appendChild(select);
		mainDiv.appendChild(infoDiv);
	},

	createPagination: function(totalPosts) {
		var pagination = document.createElement("div");
		pagination.id = "pagination";

		var start = Math.max(Vars.getPage()-3, 1);
		var end = Math.min(start + 9, Math.ceil(totalPosts/25));
		var links = "Page: ";
		var hrefBase = document.location.href.split("?")[0] + "?t=" + Vars.getTime() + "&page=";

		if(start > 1) {
			links += '<a href="'+hrefBase+1+'">1</a> ... ';
		} 

		for(var i = start; i <= end; i++) {
			if(Vars.getPage() === i) {
				links += "<span>"+i+"</span>";
			} else {
				links += '<a href="'+hrefBase+i+'">'+i+'</a>';
			}
		}

		pagination.innerHTML = links;
		mainDiv.appendChild(pagination);
	}
};
})();


if(isSupported) {
	app.loadPage();
}