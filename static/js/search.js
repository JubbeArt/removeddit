var app = (function(){
return {
	loadPage: function(){
		Vars.loadVars();
		SearchHTML.createSearch();

		if(Vars.get("search") === "true") {
			if(Vars.get("thread") === "true") {
				ElasticSearch.thread();
			} else {
				ElasticSearch.comment();
			}
		}
	}
};
})();

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
	var keys = 	["thread","text", "title", "subreddit", "author", "over_18", "locked", "removed", "deleted", "time", "sort", "search"];
	var defaults = ["true", 	"", 	    "",	  "",		"",		"both",	 "both",	 "",		  "",	   "all",  "score_dsec", "false"];
	var defaultLookup = {};
	var showAdvanced = true;

	for(var i = 0, len = keys.length; i < len; i++) {
		defaultLookup[keys[i]] = defaults[i];
	}

return {
	loadVars: function(){
		_.forEach(keys, function(key){
			lookup[key] = _.defaultTo(GetVars.get(key), defaultLookup[key]);
		});				

		showAdvanced = _.defaultTo(Cookies.get("showAdvanced"), true);
	},
	updateVars: function(){
		_.forEach(keys, function(key){
			lookup[key] = document.getElementById(key).value;
		});
	},
	get: function(key){
		if(key === "showAdvanced") {
			return showAdvanced;
		}

		return lookup[key];
	},
	generateURL : function(){
		var url = "?";
		var first = true;
		_.forEach(lookup, function(key){
			if(lookup[key] !== defaultLookup[key]) {
				if(first) {
					url += key+"="+lookup[key];
					first = false;
				} else {
					url += "&"+key+"="+lookup[key];
				}
			}
		});

		if(url === "?") {
			return "?search=true";
		}

		return url + "&search=true";
	},
	setShowAdvanced: function(shouldShowAdvaned){
		showAdvanced = shouldShowAdvaned;
	},
	lookup: lookup
};
})();


var SearchHTML = (function(){
	var mainDiv = document.getElementById("main");

	var radioInput = function(name, displayNames, values) {
		var inputs = "";
		
		for(var i = 0, len = displayNames.length; i < len; i++){
			inputs += '<span class="radioButton"'+ (Vars.lookup[name] === values[i] ? ' style="background: #239f2b; color:#fff"':'')+'>';
			inputs += '<input type="radio" id="'+name+i+'" name="'+name+'" onchange="CSS.radio(this)"';
			inputs += 'value="'+values[i]+'" '+(Vars.lookup[name] === values[i] ? ' checked "':'')+' >';
			inputs += '<label for="'+name+i+'">'+displayNames[i]+'</label></span>';
		}
		return inputs;
	};

	var textInput = function(name){
		return '<input type="text" name="'+name+'" id="'+name+'" value="'+Vars.get(name)+'">'; 
	};

	var label = function(name, display) {
		return '<label for="'+name+'">'+display+': </label>';
	};

	var inputRow = function(text, input) {
		return '<div class="search-row"><span class="search-left">'+text+'</span><span>'+input+"</span></div>";
	};

	var selectTime = function() {
		var values = ["hour", "12hour", "day", "week", "month", "6month", "year", "all"];
		var display = ["past hour", "past 12 hours", "past day", "past week", "past month", "past 6 months", "past year", "all time"];
		var html = '<select name="time" id="time">';

		for(var i = 0, len = values.length; i < len; i++) {
			html += '<option value="'+values[i]+'"' + ((Vars.get("time") === values[i]) ? " selected" : '')+'>'+display[i]+'</option>';
		}

		return html + "</select>";
	};

	var select = function(name, display, values){
		var html = '<select name="'+name+'" id="'+name+'">';
		
		for(var i = 0, len = values.length; i < len; i++) {
			html += '<option value="'+values[i]+'"' + ((Vars.get(name) === values[i]) ? " selected" : '')+'>'+display[i]+'</option>';
		}

		return html + "</select>";
	};

return {
	createSearch: function(){
		var searchBox = document.createElement("div");
		searchBox.id = "main-box";
		searchBox.className = "search-box";
	/*
		Comments:
		text			(body)		string
		title 		(title)		string
		subreddit		(subreddit)	string
		author		(author)		string
		over_18		(over_18)		sfw,nsfw,both *
		locked		(locked)		bool *
		between		(after/before)	"date"
		sort 		(sort)		asc,desc
	*/
		var html = inputRow('Im looking for: ', radioInput("thread", ["Thread","Comment"], ["true", "false"]));		
		html += inputRow(label("text", "Text"), textInput("text"));
		html += inputRow(label("title","Title"), textInput("title"));
		html += inputRow(label("subreddit", "Subreddit"), textInput("subreddit"));
		html += inputRow(label("author", "Author"), textInput("author"));
		html += inputRow("Over 18: ", radioInput("over_18", ["Both","NSFW","SFW"], ["both","nsfw","sfw"]));
		html += inputRow("Locked: ", radioInput("locked", ["Both","True", "False"], ["both","true","false"]));
		html += inputRow("Removed: ", select("removed", ["Removed and non-removed", "Only removed", "Only deleted"], ["all", "removed", "deleted"]));
		html += inputRow("From:", selectTime());
		html += inputRow("Sort: ", select("sort", ["Highest score","Lowest score","Newest","Oldest"], ["score_desc","score_asc","time_desc","time_asc"]));
		html += '<input type="button" value="'+(showAdvanced?'Hide':'Show')+' advanced">';
		html += '<input type="submit" value="Search">';
		searchBox.innerHTML = html;
	
		mainDiv.appendChild(searchBox);
	},

	commentResults: function(){

	},

	threadResults: function(){

	}
};
})();

// name
//var CSS = (function(){
return {
	radio: function(event) {
		var radioButtons = document.getElementsByName(event.name);
		
		for(var i = 0, len = radioButtons.length; i < len; i++){
			if(radioButtons[i].id == event.id) {
				radioButtons[i].parentNode.style = "background: #239f2b; color:#fff";
			} else {
				radioButtons[i].parentNode.style = "background: #8a8888; color:#000";
			}
		}
	},
	updateDisplayedOptions: function(){
		var showAdvanced = Vars.get("showAdvanced") == "true";
		var thread = document.getElementById("thread").value == "thread";
		console.log(document.getElementById("thread").value)
		var display;
		var hide;

		if(thread && showAdvanced) {
			display = ["body","title","subreddit","author","over_18","locked","removed","time","sort"];
			hide = [];
		} else if(thread && !showAdvanced) {
			display = ["body", "title", "subreddit"];
			hide = ["author","over_18","locked","removed","time","sort"];
		} else if(!thread && showAdvanced) {
			display = ["body","subreddit","author","removed","time","sort"];
			hide = ["title","over_18","locked"];
		} else if(!thread && !showAdvanced) {
			display = ["body","subreddit"];
			hide = ["title","over_18","locked", "author","removed","time","sort"];
		}

		_.forEach(display, function(id){

		});


	},
	toggleShowAdvanced: function(){
		Vars.setShowAdvanced(Vars.get("showAdvanced"));
		Cookies.set("showAdvanced", Vars.get("showAdvanced"), , { expires: 365 });
		CSS.
	}
};
})();


if(isSupported) {
	app.loadPage();
}