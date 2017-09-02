"use strict";

const markdown = SnuOwnd.getParser()

const thread_url = `https://oauth.reddit.com/r/${subreddit}/comments/${thread_id}`
const morechildren_url = `https://oauth.reddit.com/api/morechildren?link_id=t3_${thread_id}&children=`
const single_comment_url = `https://oauth.reddit.com/r/${subreddit}/api/info/?id=t1_`
const removed_comments_url = "/comments/?c="

const main_div = document.getElementById("main")
const loading_comments = document.getElementById("loading-comments")

const comment_ids = []
const morechildren_ids = []
const continuethisthread_ids = []
const max_ids_per_call = 100
const comment_lookup = new Map()
const comments_to_create = []
let total_comments

const reddit_init = {
	headers: { "Authorization": "bearer " + token }
}

load_page()

async function load_page() {
	const json = await fetch(thread_url, reddit_init).then(thread => thread.json())

	generate_thread(json)
	comment_ids.push(...get_comment_ids(json))
	
	const smaller_threads = await Promise.all(continuethisthread_ids.map(id =>fetch(thread_url + "/_/" + id.split("_")[1], reddit_init)))
	const smaller_threads_json = await Promise.all(smaller_threads.map(x => x.json()))
	smaller_threads_json.forEach(thread => comment_ids.push(...get_comment_ids(thread)))
	
	await get_morechildren_ids()
	const removed_comments = await get_removed_comments()
	
	generate_comments(removed_comments)
}

async function get_removed_comments() {
	const ids_diff = all_ids.filter(x => !comment_ids.includes(x))
	generate_comment_info(ids_diff.length)
	console.log(all_ids)
	console.log(comment_ids)
	console.log(comment_ids.length, new Set(comment_ids).size)
	console.log(ids_diff)
	return fetch_multiple(removed_comments_url, ids_diff, ["data"], true)
}

async function get_continuethisthread_ids() {
	return
}

async function get_morechildren_ids() {
	console.log("asdf")
	const responses = await Promise.all(split_array(morechildren_ids, max_ids_per_call).map(ids => fetch(morechildren_url + ids.join(), reddit_init)))
	const responses_json = await Promise.all(responses.map(x => x.json()))
	morechildren_ids.length = 0
	responses_json.forEach(extract_morechildren_ids)
	
	if(morechildren_ids.length !== 0) {
		await get_morechildren_ids()
	}
}

function extract_morechildren_ids(comments) {
	comments.jquery[14][3][0].forEach(comment => {
		if(comment.kind == "more") {
			const children = comment.data.children

			if(children.length < comment.data.count) {
				morechildren_ids.push(...children)			
			} 
			comment_ids.push(...children)
			
		} else {
			comment_ids.push(comment.data.id)
			comment_lookup.set(comment.data.id, comment.data)
		}	
	});
}
function get_comment_ids(data) {
	return flatten_array(data[1].data.children.map(extract_id_from_comment))
}

function extract_id_from_comment(comment) {
	const data = comment.data
	// "Show more"-comments
	if(comment.kind == "more") {	
		console.log(data.id)
		console.log(data.name)
		console.log(data.parent_id)
		console.log(data.children)
		console.log(data.children.length + "/" + data.count)
		console.log("-----------------------")	
		
		if(data.id === "_") {
			continuethisthread_ids.push(data.parent_id)
			return []
		}		
		if(data.children.length < data.count){
			morechildren_ids.push(...data.children)
			// ???????????????????? maybe wrong, data.id? ytest this
			//return [] //-----------------------------------
		}
		return data.children
	}
	// Normal comment
	let replies_ids = [data.id]

	if(data.replies) {
		data.replies.data.children.forEach(child => replies_ids.push(...extract_id_from_comment(child)))
		delete data.replies
	}
		
	comment_lookup.set(data.id, data)
	return replies_ids
}

// -------------------------------------------------------------------------------------
// ----------------- Comment generating functions ---------------------
// -------------------------------------------------------------------------------------

async function generate_comments(removed_comments) {
	const comment_section = document.createElement("div")
	comment_section.id = thread_id
	main_div.insertBefore(comment_section, loading_comments)
	
	removed_comments.forEach(comment => {
		comment["removed"] = true
		comment_lookup.set(comment.id, comment)
		console.log(comment.id)
	})

	const comments_to_lookup = removed_comments.map(comment => comment.id)	
	await get_comments_to_generate(comments_to_lookup)

	comments_to_create.sort(function(a, b) {
		const a_score = comment_lookup.get(a).score
		const b_score = comment_lookup.get(b).score
			
		return a_score === b_score ? 0 : (a_score > b_score ? 1 : -1)
	});
	
	create_comments()
}

async function get_comments_to_generate(comments_to_lookup) {	
	const new_comments_to_lookup = []
	
	comments_to_lookup.forEach(id => {
		const parent_id = comment_lookup.get(id).parent_id.split("_")[1]

		if(parent_id === thread_id) {} // Has no parent (is parent of thread)
		else if(comments_to_create.includes(parent_id)) {} // Parent already exists, do nothing
		else if(new_comments_to_lookup.includes(parent_id))  {} // Parent already exists (this iteration)
		else if(comment_lookup.has(parent_id)) {
				new_comments_to_lookup.push(parent_id)
		} else{
			console.error("Comment doesn't exists, HALP")
			console.log(id)
			console.log(parent_id)
		}

		comments_to_create.push(id)
	})

	if(new_comments_to_lookup.length !== 0) {
		await get_comments_to_generate(new_comments_to_lookup)
	}
}

function create_comments() {
	const created_comment_ids = [thread_id]
	let id, parent_id
	let did_something

	while(comments_to_create.length > 0) {
		did_something = false

		for(let i = comments_to_create.length -1; i >= 0; i--) {
			id = comments_to_create[i]
			parent_id = comment_lookup.get(id).parent_id.split("_")[1]

			if(created_comment_ids.includes(parent_id)) {
				document.getElementById(parent_id).appendChild(create_comment(comment_lookup.get(id)))
				created_comment_ids.push(id)
				comments_to_create.splice(i, 1)
				did_something = true
			}
		}

		if(!did_something) {
			console.error("Didn't generate all comments correctly")
			break
		}
	}
}

// -------------------------------------------------------------------------------------
// --------------------- HTML-generating functions ----------------------
// -------------------------------------------------------------------------------------

function generate_thread(data) {
	const thread = data[0].data.children[0].data
	const thread_div = document.createElement("div")
	thread_div.id = "thread"
	thread_div.innerHTML  = `
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
	`

	main_div.insertBefore(thread_div,  loading_comments)
	total_comments = thread.num_comments
}
function create_comment(comment) {
	const comment_div = document.createElement("div")
	comment_div.id = comment.id
	comment_div.className = "comment comment-" + (comment.hasOwnProperty("removed")  ? "removed" :  (comment.depth % 2 == 0 ? "even" : "odd"));
	comment_div.innerHTML = `
		<div class="comment-head">
			<a href="javascript:void(0)" class="user-link">[–]</a>
			<a href="https://www.reddit.com/user/${comment.author}" class="user-link comment-author">${comment.author}</a>
			<span class="comment-score">${pretty_score(comment.score)} point${(comment.score == 1) ? '': 's'}</span>
			<span class="comment-time">${pretty_date(comment.created_utc) }</span>
		</div>
		<div class="comment-body">${markdown.render(comment.body)}</div>
		<div class="comment-links">
			<a href="https://todo.com">permalink</a>
		</div>
	`
	return comment_div
}

function generate_comment_info(removed_comments) {
	const comment_info = document.createElement("div")
	comment_info.innerHTML = `
		<div id="comment-info">
			removed comments: ${removed_comments}/${total_comments} (${ (100 * removed_comments / total_comments).toFixed(1)}%)
		</div>
		<div id="comment-sort">sorted by: top</div>
	`
	main_div.insertBefore(comment_info, loading_comments)
}
// -------------------------------------------------------------------------------------
// ----------------------------- AJAX-functions ---------------------------------
// -------------------------------------------------------------------------------------

async function fetch_multiple(url, data, json_walkdown=[], flattening=false) {
	const responses = await Promise.all(split_array(data, max_ids_per_call).map(single_request_data => fetch(url + single_request_data.join())))
	let json = await Promise.all(responses.map(x => x.json()))
	json_walkdown.forEach(property =>{
		json.forEach((x, i) => json[i] = json[i][property])
	})
	return flattening ? flatten_array(json) : json
}
// -------------------------------------------------------------------------------------
// ---------------- Other less interesting functions ---------------------
// -------------------------------------------------------------------------------------

function split_array(array, size) {
	const array_split = []
	
	for(let i = 0, len = array.length ; i < len; i += size) {
		array_split.push(array.slice(i, i + size))
	}

	return array_split
}

function flatten_array(arrays) {
	return arrays.reduce((array, item) => { return array.concat(item) }, [])
}

// UTC -> "Reddit time format"
function pretty_date(created_utc) {
	const current_utc = Math.floor((new Date()).getTime() / 1000)
	const second_diff = current_utc - created_utc
	const day_diff = Math.floor(second_diff / 86400) 
	
	if(day_diff < 0)
		return ''

	if(day_diff == 0) {
		if(second_diff < 10)
			return "just now"
		if(second_diff < 60)
			return second_diff + " seconds ago"
		if(second_diff < 120)
			return "a minute ago"
		if(second_diff < 3600)
			return Math.floor(second_diff / 60) + " minutes ago"
		if(second_diff < 7200)
			return "an hour ago"
		if(second_diff < 86400)
			return Math.floor(second_diff / 3600) + " hours ago"
	}
	if(day_diff == 1)
		return "Yesterday"
	if(day_diff < 7)
		return day_diff + " days ago"
	if(day_diff < 31)
		return Math.floor(day_diff / 7) + " weeks ago"
	if(day_diff < 365)
		return Math.floor(day_diff / 30) + " months ago"
	return Math.floor(day_diff / 365) + " years ago"
}

function pretty_score(score) {
	return score >= 10000 ? (score / 1000).toFixed(1) + "k" : score
}