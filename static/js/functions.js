"use strict";

// Little display-bar in the upper right corner
var Status = (function(){
	var loadingText = document.getElementById("status-text");
	var statusImage = document.getElementById("status-image");
	var loadingImg = "/static/images/loading.gif";
	var successImg = "/static/images/done.png";
	var errorImg = "/static/images/error.png";

return {
	loading: function(msg) {
		statusImage.src = loadingImg;
		loadingText.innerHTML = msg;
	},
		
	success: function(msg) {
		msg = _.defaultTo(msg, "");
		statusImage.src = successImg;
		loadingText.innerHTML = msg;
	},

	error: function(msg) {
		statusImage.src = errorImg;
		loadingText.innerHTML = "<b>"+msg+"</b>";
		console.error(msg);
	}
}})();


// Check browser support
var isSupported = self.fetch && self._ && self.Promise;

if(!isSupported) {
	(function() {
		var isMissing = [];

		if(!self.fetch) isMissing.push("fetch");
		if(!self.Promise) isMissing.push("promise");
		if(!self._) isMissing.push("lodash");

		var url = "https://www.reddit.com/message/compose/?to=Jubbeart";
		url += "&subject="+encodeURIComponent("Missing dependencies: " + isMissing.join(" "));
		url += "&message="+encodeURIComponent("Comment (optional): ");
		url += "%0A%0A"+encodeURIComponent("Browser details: "+navigator.userAgent);
		Status.error("Error: Missing dependencies ("+isMissing+"). Contact <a href=\""+url+"\">/u/jubbeart</a>");
	})();
}


// Reddit API
var Reddit = (function() {
	var init = {headers: {"Authorization": ""}};
	
return {
	init: init,
	subreddit: _.defaultTo(window.location.pathname.split("/")[2], 'all'),
	threadID: window.location.pathname.split("/")[4],
	permalink: window.location.pathname.split("/")[6],
	fetchToken: function() {		
		return fetch("https://www.reddit.com/api/v1/access_token", {
			headers: {
				"Authorization": "Basic " + btoa(clientID + ":"),
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			method: "POST",
			body: "grant_type="+encodeURIComponent("https://oauth.reddit.com/grants/installed_client")+"&device_id=DO_NOT_TRACK_THIS_DEVICE"
		})
		.then(function(response) { 
			if(response.ok) {
				return response.json();
			} else {
				return Promise.reject("Can't connect to Reddit API");
			}
		})
		.then(function(json) {
			init.headers.Authorization = "bearer " + json.access_token;
		})
		.catch(function(error) {
			return Promise.reject("Can't connect to Reddit API");
		});		
	}
}})();


// Helper functions for fetch
var Fetch2 = (function(){
return {
	multiple: function(urls, init, jsonPath, flattening) {
		flattening = _.defaultTo(flattening, true);
		jsonPath = _.defaultTo(jsonPath, null);
		
		return Promise.all(_.map(urls, function(url) { 
			return fetch(url, init)
			.then(Fetch2.json)
			.then(function(jsonArray) {
				if(! _.isNil(jsonPath)) {
					return _.get(jsonArray, jsonPath);
				}
				return jsonArray;
			});
		}))
		.then(function(dataArray) {
			if(flattening) {
				return _.flatten(dataArray);
			}
			return dataArray;
		});
	},
	json: function(response) {
		return response.json();
	}
}})();

var URLs = (function(){
	var reddit = "https://oauth.reddit.com";
	var pushshift = "https://api.pushshift.io";
	var elastic = "https://elastic.pushshift.io";
	var maxItemsPerRequest = 100;

	return {
		format: function(url, data, chunkSize) {
			chunkSize = _.defaultTo(chunkSize, maxItemsPerRequest);
			var dataChunks = _.chunk(data, chunkSize);
			return _.map(dataChunks, function(chunk) { return url + chunk; })
		},
		pushshiftComments:	pushshift+"/reddit/comment/search?ids=",
		pushshiftIDs:		pushshift+"/reddit/submission/comment_ids/"+Reddit.threadID,
		thread:			reddit+"/r/"+Reddit.subreddit+"/comments/"+Reddit.threadID,
		moreChildren:		reddit+"/api/morechildren?link_id=t3_"+Reddit.threadID+"&children=",
		singleComments:	reddit+"/r/"+Reddit.subreddit+"/api/info/?id=",
		subreddit:		reddit+"/r/"+Reddit.subreddit,
		elasticThreads: 	elastic+"/rs/submissions/_search?source="
	};
})();


// HTML parsing
var HTML = (function (){
return {
	parse: function(htmlString) {
		var tmpDiv = document.createElement('div')
		tmpDiv.innerHTML = htmlString
		return tmpDiv.childNodes.length === 0 ? "" : tmpDiv.childNodes[0].nodeValue
	}
};
})();


var Time = (function(){
return {
	utc: function() {
		return Math.floor(_.now()/1000);
	},

	toUTC: function(timeString) {
		var parts = timeString.split(/[a-zA-Z]+/);
		var times = 1;

		if(parts.length === 2 && parts[0] !== "") {
			times = _.parseInt(parts[0]);
		}

		if(_.includes(timeString, "hour")) return times * 3600;
		if(_.includes(timeString, "day")) return times * 86400;
		if(_.includes(timeString, "week")) return times * 604800;
		if(_.includes(timeString, "month")) return times * 2592000;
		if(_.includes(timeString, "year")) return times * 31536000;
		
		return Time.utc();
	},
	
	difference: function(utc) {
		return Time.utc() - utc;
	}
};
})();

var GetVars = (function(){
return {
	get: function(variable) {
		var urlParts = window.location.href.split("?");
		if(urlParts.length <= 1) {
			return undefined;
		}

		var getVariables = urlParts[1].split("&");
		
		for(var i = 0, len = getVariables.length; i < len; i++) {
			var keyAndValue = getVariables[i].split("=");
			
			if(keyAndValue[0] === variable) {
				return keyAndValue[1];
			}
		}

		return undefined;
	},

	set: function(variable, value) {
		window.location.href = window.location.href.split("?")[0] + "?"+variable+"="+value;
	}
};
})();


// For text formatting
var Format = (function () {
	var markdown = SnuOwnd.getParser();
return {
	parse: function(text){
		return markdown.render(text)
	},	
	// UTC -> "Reddit time format" (e.g. 5 hours ago, just now, etc...)
	prettyDate: function(createdUTC){
		var currentUTC = Math.floor((new Date()).getTime() / 1000);
		var secondDiff = currentUTC - createdUTC;
		var dayDiff = Math.floor(secondDiff / 86400);
		
		if(dayDiff < 0)	return "";
		if(dayDiff == 0) {
			if(secondDiff < 10)		return "just now";
			if(secondDiff < 60)		return secondDiff + " seconds ago";
			if(secondDiff < 120)	return "a minute ago";
			if(secondDiff < 3600)	return Math.floor(secondDiff / 60) + " minutes ago";
			if(secondDiff < 7200)	return "an hour ago";
			if(secondDiff < 86400)	return Math.floor(secondDiff / 3600) + " hours ago";
		}
		if(dayDiff < 7)	return dayDiff + " days ago";
		if(dayDiff < 31)	return Math.floor(dayDiff / 7) + " weeks ago";
		if(dayDiff < 365)	return Math.floor(dayDiff / 30) + " months ago";
		return Math.floor(dayDiff / 365) + " years ago";
	},
	// e.g. 12000 => 12k
	prettyScore: function(score) {
		if(score >= 100000) {
			return (score / 1000).toFixed(0) + "k";
		} else if(score >= 10000) {
			return (score / 1000).toFixed(1) + "k";
		}

		return  score;
	}
}})();