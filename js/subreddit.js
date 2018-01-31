'use strict';

let app = (function () {
  return {
    loadPage() {
		Status.loading("Loading subreddit...");
		document.title = Reddit.isAll ? "all subreddits" : Reddit.subreddit;
		HTML.main.innerHTML += _.templates.subredditInfo({subreddit: Reddit.subreddit, time: Vars.time});

		var urlData = {
			subreddit:	Reddit.subreddit, 
			time:		Time.difference(Vars.time), 
			page:		Vars.page,
			postPerPage:	Vars.postPerPage
		};

		Fetch2.get(ElasticSearch.threadURL+_.templates.elasticSubreddit(urlData), "Could not get removed posts")
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
	},
  }
}());

