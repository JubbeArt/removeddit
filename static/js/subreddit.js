"use strict";

var app = (function(){
return {
	loadPage: function() {
		Status.loading("Loading subreddit...");
		document.title = Reddit.isAll ? 'all subreddits' : Reddit.subreddit;
		HTML.main.innerHTML += _.templates.subredditInfo({subreddit: Reddit.subreddit, time: Vars.time});

		Fetch2.get(ElasticSearch.subreddit(Reddit.subreddit, Time.difference(Vars.time), Vars.page), "Could not get removed posts")
		.then(Fetch2.json)
		.then(function(json){
			var startPostNr = (Vars.page - 1) * Vars.postPerPage + 1;
			
			_.forEach(json.hits.hits, function(subreddit, i){
				HTML.main.innerHTML += _.templates.thread({thread: subreddit._source, postNr: startPostNr+i});
			});

			var start = Math.max(Vars.page - 3, 1);
			var end = Math.min(start + 9, Math.ceil(json.hits.total/Vars.postPerPage));
			var urlBase = document.location.href.split("?")[0] + "?t=" + Vars.time + "&page=";
			HTML.main.innerHTML += _.templates.subredditPagination({start:start,end:end,currentPage:Vars.page,urlBase:urlBase});
			Status.success();		
		})
		.catch(Fetch2.handleError);
	}
};
})();

var Vars = (function(){
	return {
		postPerPage: 50,
		time: _.defaultTo(GetVars.get("t"), Reddit.isAll ? "12hour" : "day"),
		page: _.defaultTo(_.parseInt(GetVars.get("page")), 1),
		reload: function(event) {
			document.location.href = document.location.href.split("?")[0] + "?t=" + event.value;
		}
	};
})();

var ElasticSearch = (function(){
return {
	subreddit: function(subreddit, time, page){
		var condition = '[{"term":{"subreddit":"'+_.toLower(subreddit)+'"}},'+
		'{"range":{"created_utc":{"gt":'+time+'}}}]';

		if(Reddit.isAll) {
			condition = '{"range":{"created_utc":{"gt":'+time+'}}}';
		}

		return 'https://elastic.pushshift.io/rs/submissions/_search?source={'+
		'"query":{'+
			'"bool":{'+
				'"must":'+condition+
			'}'+
		'},'+
		'"_source":["author","url","subreddit","link_flair_text","score","title","created_utc","selftext","num_comments","domain","permalink","id","thumbnail","thumbnail_height","thumbnail_width"],'+
		'"sort":[{"score":"desc"}],'+
		'"from":'+(page-1)*Vars.postPerPage+','+
		'"size":'+Vars.postPerPage+'}';
	}	
};
})();

if(isSupported) {
	app.loadPage();
}