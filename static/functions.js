"use strict";

// Little display-bar in the upper right corner
var Status = (function(){
	var loadingText = document.getElementById("loading-text");
	var statusImage = document.getElementById("loading-image");
	var loadingImg = "/static/loading.gif";
	var successImg = "/static/done.png";
	var errorImg = "/static/error.png";

return {
	loading: function(msg) {
		statusImage.src = loadingImg
		loadingText.innerHTML = msg
	},
		
	success: function(msg) {
		msg = _.defaultTo(msg, "")
		statusImage.src = successImg
		loadingText.innerHTML = msg
	},

	error: function(msg) {
		statusImage.src = errorImg
		loadingText.innerHTML = "<b>ERROR: " + msg + "</b>"
		console.error(msg)
	}
}})()


// Reddit API
var Reddit = (function() {
	var init = {headers: {"Authorization": ""}};
	
return {
	init: init,
	subreddit: window.location.pathname.split("/")[2],
	threadID: window.location.pathname.split("/")[4],
	fetchToken: function() {		
		return fetch("https://www.reddit.com/api/v1/access_token", {
			headers: {
				"Authorization": "Basic " + btoa(clientID + ":"),
				"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
			},
			method: "POST",
			body: "grant_type="+encodeURIComponent("https://oauth.reddit.com/grants/installed_client")+"&device_id=DO_NOT_TRACK_THIS_DEVICE"
		})		
		.then(function(response) { return response.json() })
		.then(function(json) {
			init.headers.Authorization = "bearer " + json.access_token;
		});
	}
}})()


// Helper functions for fetch
var Fetch2 = (function(){
	var json = function(response) {
		return response.json();
	};

return {
	multiple: function(urls, init, jsonPath, flattening) {
		flattening = _.defaultTo(flattening, true);
		jsonPath = _.defaultTo(jsonPath, null);
		
		return Promise.all(_.map(urls, function(url) { 
			return fetch(url, init)
			.then(json)
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
	json: json
}})()

var URLs = (function(){
	var reddit = "https://oauth.reddit.com";
	var pushshift = "https://api.pushshift.io";
	var maxItemsPerRequest = 100;

	return {
		format: function(url, data, chunkSize) {
			chunkSize = _.defaultTo(chunkSize, maxItemsPerRequest);
			var dataChunks = _.chunk(data, chunkSize);
			return _.map(dataChunks, function(chunk) { return url + chunk; })
		},
		pushshiftComments:pushshift+"/reddit/comment/search?ids=",
		pushshiftIDs:	pushshift+"/reddit/submission/comment_ids/"+Reddit.threadID,
		thread:		reddit+"/r/"+Reddit.subreddit+"/comments/"+Reddit.threadID,
		moreChildren:	reddit+"/api/morechildren?link_id=t3_"+Reddit.threadID+"&children=",
		singleComments:	reddit+"/r/"+Reddit.subreddit+"/api/info/?id="
	};
})()


// HTML parsing
var HTML = (function (){
return {
	parse: function(htmlString) {
		var tmpDiv = document.createElement('div')
		tmpDiv.innerHTML = htmlString
		return tmpDiv.childNodes.length === 0 ? "" : tmpDiv.childNodes[0].nodeValue
	}
}})()


// For text formatting
var Format = (function () {
	var markdown = SnuOwnd.getParser();
return {
	parse: function(text){
		return markdown.render(text)
	},	
	// UTC -> "Reddit time format" (5 hours ago, just now, etc...)
	prettyDate: function(createdUTC){
		var currentUTC = Math.floor((new Date()).getTime() / 1000);
		var secondDiff = currentUTC - createdUTC;
		var dayDiff = Math.floor(secondDiff / 86400);
		
		if(dayDiff < 0)	return "";
		if(dayDiff == 0) {
			if(secondDiff < 10)	return "just now";
			if(secondDiff < 60)	return secondDiff + " seconds ago";
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
	// 12000 => 1.2k
	prettyScore: function(score) {
		return score >= 10000 ? (score / 1000).toFixed(1) + "k" : score;
	}
}})()