"use strict";

const markdown = SnuOwnd.getParser();

const thread_url = `https://oauth.reddit.com/r/${subreddit}/comments/${thread_id}`;
const morechildren_url = `https://oauth.reddit.com/api/morechildren?link_id=t3_${thread_id}&children=`;
const single_comment_url = `https://oauth.reddit.com/r/${subreddit}/api/info/?id=t1_`;
const removed_comments_url = "/comments/?c=";

const main_div = document.getElementById("main");

const loading_comments = document.getElementById("loading-comments");

const comment_ids = new Set();
const comment_lookup = new Map();
const comments_to_generate = [];
const comments_to_generate_ids = new Set();
let ajax_calls_left = 0;
let total_comments;

get(thread_url, response => {
	const json = JSON.parse(response);
	//generate_thread(json[0].data.children[0].data);
	//get_comment_ids(json[1].data.children);
});

function generate_thread(thread) {
	const thread_div = document.createElement("div");
	thread_div.id = "thread";

	const thread_string = `
		<div id="thread-score-box">
			<div class="vote upvote"></div>
			<div id="thread-score">${pretty_score(thread.score)}</div>
			<div class="vote downvote"></div>
		</div>
		<div id="thumbnail"></div>
		<div id="thread-content">
			${thread.link_flair_text !== null ? '<span class="link-flair">'+thread.link_flair_text+'</span>' : ''}
			<a id="thread-title" href="${thread.url}">${thread.title}</a>
			<span id="domain">(${thread.domain})</span>
			<div id="thread-info">
				submitted <span id="thread-time">${pretty_date(thread.created_utc)}</span> by 
				<a id="thread-author" class="user-link" href="https://www.reddit.com/user/${thread.author}">${thread.author}</a> to 
				<a id="subreddit-link" href="https://reddit.com/r/${subreddit}">/r/${subreddit}</a>
			</div>
			${thread.selftext !== '' ? '<div id="thread-selftext" class="user-text">'+markdown.render(thread.selftext)+'</div>':''}
		</div>
	`;

	thread_div.innerHTML = thread_string;
	main_div.insertBefore(thread_div,  loading_comments);
	total_comments = thread.num_comments;
}

function get_comment_ids(comments) {
	comments.forEach(comment => extract_id_from_comment(comment));

	if(ajax_calls_left == 0) {
		get_all_comment_ids();	
	}
}

function extract_id_from_comment(comment) {
	// "Show more"-comments
	if(comment.kind == "more") {
		const children = comment.data.children;
				
		// Some "show more"-comments were missing, need to do more ajax-calls
		if(children.length < comment.data.count){
			ajax_calls_left++;
			get(morechildren_url + children.join(), response => handle_show_more_comments(JSON.parse(response)));
		}

		if(children.length > 0) {
			comment_ids.add(...children);
		}
	}
	// Normal comment
	else {
		const data = comment.data;
		
		if(data.replies) {
			data.replies.data.children.forEach(child => extract_id_from_comment(child));
		}
		
		delete data.replies;
		comment_lookup.set(data.id, data);
		comment_ids.add(data.id);
	}
}

function handle_show_more_comments(comments) {
	
	comments.jquery[14][3][0].forEach(comment => {
		if(comment.kind == "more") {
			let children = comment.data.children;

			if(children.length < comment.data.count) {
				ajax_calls_left++;
				get(morechildren_url + children.join, response => handle_show_more_comments(JSON.parse(response)));
			}

			comment_ids.add(...children);
		} else {
			comment_ids.add(comment.data.id);
			comment_lookup.set(comment.data.id, comment.data);
		}		
	});
	
/*

	for(var i = 0, len = comments.length; i < len; i++){
		if(comments[i].kind == "more") {
			var children = comments[i].data.children;
			
			if(children.length < comments[i].data.count) {
				ajax_calls_left++;
				get(morechildren_url + thread_id + "&children=" + children.join(), function(data){
					handle_show_more_comments(JSON.parse(data))
				});	
			}
			
			add_id(children);
			
		} else {
			add_id(comments[i].data.id);
			comment_lookup[comments[i].data.id] = comments[i].data;
		}	
	}
*/	
	ajax_calls_left--;
	
	if(ajax_calls_left == 0) {
		get_all_comment_ids();
	}
}


function get_all_comment_ids() {
	const ids_diff = new Set([...all_ids].filter(x => !comment_ids.has(x)));
	console.log(all_ids);
	console.log(comment_ids);
	console.log(ids_diff);
	
	if(ids_diff.size > 100) {
		alert("very many removal, aborting");
		return;
	}
	
	get(removed_comments_url + [...ids_diff].join(), response => create_comments(JSON.parse(response).data));
}

function create_comments(comments) {
	create_comment_info(comments.length);

	comments.forEach(comment => {
		comment["removed"] = true;
		comments_to_generate.push(comment);
		comments_to_generate_ids.add(comment.id);
		comment_lookup.set(comment.id, comment);
	});

	//create_parent_comments();

/*	
	for(var i = 0; i < comments.length; i++) {
		comment = create_comment(comments[i], true);
		comment_section.appendChild(comment);
		comment_lookup[comments[i].id] = comments[i];
	}
	*/
	//add_parent_comments();

}

function create_parent_comments() {
	let done = true;
	let parent_id;
	let comment;

	for(let i = comments_to_generate.length - 1; i >= 0; i--) {
		//console.log(comments[i]);
		comment = comments_to_generate[i];

		parent_id = comment_lookup.get(comment.id).parent_id.split("_")[1];
			
		// Done with this comment
		if(parent_id == thread_id || comments_to_generate_ids.has(parent_id)) {	} 
		// comment exists in lookup but hasnt been added to the queue yet
		else if(comment_lookup.has(parent_id)) {
			comments_to_generate.push(comment);
			comments_to_generate_ids.add(comment.id);
			done = false;
		} 
		// parent comment doesn't exists
		else {
			get(single_comment_url + parent_id, response => {
				let new_comment = JSON.parse(data).data.children[0].data;
				
				comments_to_generate.push(new_comment);
				comments_to_generate_ids.add(new_comment.id);
				create_parent_comments();	
				console.log(parent_id, " created via /api/info ???");
			});
			done = false;
			console.log(i, " doesn't exist");
		}

		console.log(i);
	}
	
	if(!done) {
		create_parent_comments();
	} else {
		generate_comments();
	}

}

function generate_comments() {
	const comment_section = document.createElement("div");
	comment_section.id = "comments";
	main_div.insertBefore(comment_section, loading_comments);
	
	sort_comments();
	comments_to_generate.forEach(comment => {
		comment_section.appendChild(create_comment(comment));
	});
}

function create_comment(comment) {
	const comment_div = document.createElement("div");
	comment_div.className = "comment " + (comment.hasOwnProperty("removed") ? "comment-removed" : "");
	comment_div.id = comment.id;
	
	const comment_html = `
		<div class="comment-head">
			<a href="javascript:void(0)" class="user-link">[–]</a>
			<a href="https://www.reddit.com/user/${comment.author}" class="user-link comment-author">${comment.author}</a>
			<span class="comment-score">${comment.score} point${(comment.score == 1) ? '': 's'}</span>
			<span class="comment-time">${pretty_date(comment.created_utc) }</span>
		</div>
		<div class="comment-body">${markdown.render(comment.body)}</div>
		<div class="comment-links">
			<a href="https://todo.com">permalink</a>
		</div>
	`;

	comment_div.innerHTML = comment_html;
	return comment_div;
}

/*function create_parent_comments() {
	var comment_section = document.getElementById("comments"); 
	var comments = comment_section.children;
	var parent_id;
	var comment;
	var created_comments = [];
	var done = true;
	
	for(var i = comments.length - 1; i >= 0; i--) {
		//console.log(comments[i]);
	
		parent_id = comment_lookup[comments[i].id].parent_id;
		
		if(parent_id.includes("_")) {
			parent_id = parent_id.split("_")[1];
		}
	
		// Done with this comment
		if(parent_id == thread_id) {
			//console.log(i, "done");
		}
		// Check if parent already exists
		else if(comments_on_display.has(parent_id)) {
			document.getElementById(parent_id).appendChild(comments[i]);
			//console.log(i, "comment already exists");	
			done = false;	
		} 
		// comment_data exists but parent comment hasn't been created yet
		else if(comment_lookup.hasOwnProperty(parent_id)) {
			//created_comments.push(create_comment(comments_data[parent_id]));
			comment_section.appendChild(create_comment(comment_lookup[parent_id], false));
			//console.log(i, " comment data exists");
			//done = false;
		} 
		// parent comment doesn't exists
		else {
			get(single_comment_url + parent_id, function(data){
				var comment = create_comment(JSON.parse(data).data.children[0].data, false);
				comment_section.appendChild();
				add_parent_comments();	
				console.log(parent_id, " created via /api/info ???");
			});
	
			console.log(i, " doesn't exist");
		}
	}
	
	if(!done) {
		add_parent_comments();
	} else {
		fix_background_color();
		sort_comments();
	}

}
*/

function create_comment_info(removed_comments) {
	const comment_info = document.createElement("div");
	comment_info.innerHTML = `
		<div id="comment-info">
			removed comments: ${removed_comments}/${total_comments} (${ (100 * removed_comments / total_comments).toFixed(1)}%)
		</div>
		<div id="comment-sort">sorted by: top</div>
	`;

	main_div.insertBefore(comment_info, loading_comments);
}

function fix_background_color(root = document.getElementById("comments"), depth = 0) {
	var comments = document.getElementById("comments").children;
	
	
	
	for(var i = 0, len = comments.length; i < len; i++) {
		//if(!comments.
		
		//comments.
	}

}
//https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement
function sort_comments() {
	comments_to_generate.sort(function(a, b) {
		if(a.score == b.score) {
			return 0;
		}		
		return a.score < b.score ? 1 : -1; 
	});
}

// ---------------- Other less interesting functions ------------------------

function get(url, callback) {
	const xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			callback(this.responseText);
		} else if (this.readyState == 4) {
			alert(this.status + " error: " + this.responseText);
			// Error handle
		}	
	}
	
	xhttp.open("GET", url, true);
	xhttp.setRequestHeader("Authorization", "bearer " + token);
	xhttp.send();
}

function add_id(id) {
	if(id instanceof Array) {
		comment_ids.add(...id);
	} else {
		comment_ids.add(id);
	}
}

// UTC -> "Reddit time format"
function pretty_date(created_utc) {
	const current_utc = Math.floor((new Date()).getTime() / 1000);
	const second_diff = current_utc - created_utc;
	const day_diff = Math.floor(second_diff / 86400); 
	
	if(day_diff < 0)
		return '';

	if(day_diff == 0) {
		if(second_diff < 10)
			return "just now";
		if(second_diff < 60)
			return second_diff + " seconds ago";
		if(second_diff < 120)
			return "a minute ago";
		if(second_diff < 3600)
			return Math.floor(second_diff / 60) + " minutes ago";
		if(second_diff < 7200)
			return "an hour ago";
		if(second_diff < 86400)
			return Math.floor(second_diff / 3600) + " hours ago";
	}
	if(day_diff == 1)
		return "Yesterday";
	if(day_diff < 7)
		return day_diff + " days ago";
	if(day_diff < 31)
		return Math.floor(day_diff / 7) + " weeks ago";
	if(day_diff < 365)
		return Math.floor(day_diff / 30) + " months ago";
	return Math.floor(day_diff / 365) + " years ago";
}

function pretty_score(score) {
	if(score >= 10000) {
		return (score / 1000).toFixed(1) + "k";
	} else {
		return score;
	}
}