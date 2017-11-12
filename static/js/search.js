var app = (function(){
return {
	loadPage: function(){

		SearchHTML.createSearch();
	}
};
})();

/*

Comments:
comment body 	(body)		string
sort 		(sort)		asc,desc
author		(author)		string
subreddit		(subreddit)	string
between		(after/before)	"date"


Thread:
title 		(title)		string
selftext 		(body)		string
sort 		(sort)		asc,desc
author		(author)		string
subreddit		(subreddit)	string
between		(after/before)	"date"
over_18		(over_18)		sfw,nsfw,both
locked		(locked)		bool

*/

var ElasticSearch = (function(){
return {
	comment: function(){

	},
	thread: function(){

	}
};
})();


var Vars = (function(){
	var lookup = {};
	var keys = [];
	var defaults = [];

return {
	loadVars: function(){

	},
	get: function(key){
		return lookup[key];
	}
};
})();


var SearchHTML = (function(){
	var mainDiv = document.getElementById("main");

	var createRadioInput = function(name, displayNames, values, defaultValue) {
		var inputs = "";
		
		for(var i = 0, len = displayNames.length; i < len; i++){
			inputs += '<input type="radio" id="'+name+i+'" name="'+name+'" ';
			inputs += 'value="'+values[i]+'" '+(defaultValue === values[i] ? 'checked':'')+' >';
			inputs += '<label for="'+name+i+'">'+displayNames[i]+'</label>';
		}
		return inputs;
	};

	var inputRow = function(text, input) {

	}

return {
	createSearch: function(){
		var searchBox = document.createElement("div");
		searchBox.id = "searchBox";

		var showAdvanced = _.defaultTo(Cookies.get("showAdvanced"), true);
		var searchThread = _.defaultTo(Cookies.get("searchThread"), true);
/*
Thread:
title 		(title)		string 	*
selftext 		(body)		string 	*
sort			(sort)		asc,desc	*
author		(author)		string	*
subreddit		(subreddit)	string	*
between		(after/before)	"date"
over_18		(over_18)		sfw,nsfw,both *
locked		(locked)		bool		*
*/
		var html = 'Im looking for: ';
		html += '<input type="radio" id="threadSearch" name="search" value="thread"'+(searchThread ? ' checked ':'')+'><label for="threadSearch">Thread</label>';
		html += '<input type="radio" id="commentSearch" name="search" value="comment"'+(!searchThread ? ' checked ':'')+'><label for="commentSearch">Comment</label>';
		html += '<label for="title">Title: </label><input type="text" id="title" name="title">';
		html += '<label for="threadBody">Selftext: </label><input type="text" id="threadBody" name="body">';
		html += '<label for="threadSubreddit">Subreddit: </label><input type="text" id="threadSubreddit" name="subreddit">';
		html += '<label for="threadAuthor">Author: </label><input type="text" id="threadAuthor" name="author">';
		html += 'Posted between time &lt time &l time';
		html += "Over 18: ";
		html += createRadioInput("over_18", ["Both","nsfw","sfw"], ["both","nsfw","sfw"], _.defaultTo(GetVars.get("over_18"), "both"));
		html += "Locked: ";
		html += createRadioInput("locked", ["Both","True", "False"], ["both","true","false"], _.defaultTo(GetVars.get("locked"), "both"));
		html += "Sort score: ";
		html += createRadioInput("sort", ["Highest","Lowest"], ["desc","asc"], _.defaultTo(GetVars.get("sort"), "desc"));
		searchBox.innerHTML = html;
	
		mainDiv.appendChild(searchBox);
	},

	commentResults: function(){

	},

	threadResults: function(){

	}
};
})();


if(isSupported) {
	app.loadPage();
}