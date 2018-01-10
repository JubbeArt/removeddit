"use strict";

// Little display-bar in the upper right corner
var Status = (function(){
	var loadingText = document.getElementById("status-text");
	var statusImage = document.getElementById("status-image");

	return {
		loading: function(msg) {
			statusImage.src = "/static/images/loading.gif";
			loadingText.innerHTML = msg;
		},
			
		success: function(msg) {
			statusImage.src = "/static/images/done.png";
			loadingText.innerHTML = _.defaultTo(msg, "");
		},

		error: function(msg) {
			statusImage.src = "/static/images/error.png";
			loadingText.innerHTML = "<b>"+msg+"</b>";
			console.error(msg);
		}
	};
})();


// Check browser support
var isSupported = self.fetch && self._ && self.Promise;

// If not supported show error
if(!isSupported) {
	(function() {
		var isMissing = [];

		if(!self.fetch) isMissing.push("fetch");
		if(!self.Promise) isMissing.push("promise");
		if(!self._) isMissing.push("lodash");

		// And a link with an error report to reddit... maybe not best way but its something
		var url = "https://www.reddit.com/message/compose/?to=Jubbeart";
		url += "&subject="+encodeURIComponent("Missing dependencies: " + isMissing.join(" "));
		url += "&message="+encodeURIComponent("Comment (optional): ");
		url += "%0A%0A"+encodeURIComponent("Browser details: "+navigator.userAgent);
		Status.error("Error: Missing dependencies ("+isMissing+"). Contact <a href=\""+url+"\">/u/jubbeart</a>");
	})();
}

var Reddit = (function() {	
	var subreddit = _.defaultTo(window.location.pathname.split("/")[2], 'all');
	
	return {
		subreddit:	subreddit,
		isAll:		_.toLower(subreddit) === 'all',
		threadID:		window.location.pathname.split("/")[4],
		permalink:	window.location.pathname.split("/")[6]
	};
})();

var Fetch2 = (function(){
	return {
		get: function(url, error){
			return fetch(url)
			.catch(function(error){
				return Promise.reject(error);
			})
			.then(function(response){
				if(response.ok) {
					return response;
				} else {
					return Promise.reject(error);
				}
			});
		},

		json: function(response) {
			return response.json();
		},

		handleError: function(error) {
			if(_.includes(_.toLower(error), "error")) {
				Status.error(error);
			} else {
				Status.error("Error: "+error);
			}
		}
	};
})();

var ElasticSearch = (function() {
	var elastic = "https://elastic.pushshift.io";

	return {
		thread: function(){},
		comment: function(){},
		threadURL: elastic+"/rs/submissions/_search?source=",
		commentURL: elastic+"/rc//comments/_search?source="
	};
})();

// HTML parsing
var HTML = (function (){
	return {
		parse: function(htmlString) {
			var tmpDiv = document.createElement('div');
			tmpDiv.innerHTML = htmlString;
			return tmpDiv.childNodes.length === 0 ? "" : tmpDiv.childNodes[0].nodeValue;
		},
		main: document.getElementById("main")
	};
})();


// UTC time handling, very usefull when dealing with elasticsearch
var Time = (function(){
return {
	utc: function() {
		return Math.floor(_.now()/1000);
	},

	toUTC: function(timeString) {
		var parts = timeString.split(/[a-zA-Z]+/);
		var times = 1;

		// Number before the time (e.g. 2years or 12hour)
		if(parts.length === 2 && parts[0] !== "") {
			times = _.parseInt(parts[0]);
		}

		if(_.includes(timeString, "hour")) 	return times * 3600;
		if(_.includes(timeString, "day")) 		return times * 86400;
		if(_.includes(timeString, "week")) 	return times * 604800;
		if(_.includes(timeString, "month")) 	return times * 2592000;
		if(_.includes(timeString, "year")) 	return times * 31536000;
		
		return Time.utc();
	},
	
	difference: function(timeString) {
		return Time.utc() - Time.toUTC(timeString);
	}
};
})();

// The get variables used in the url
var GetVars = (function(){
	return {
		get: function(key) {
			var pairs = _.defaultTo(window.location.href.split("?")[1], "").split("&");
			
			for(var i = 0, len = pairs.length; i < len; i++) {
				if(pairs[i].split("=")[0] === key) {
					return pairs[i].split("=")[1];
				}
			}

			return undefined;
		}
	};
})();


