"use strict";

const markdown = SnuOwnd.getParser()
const htmlParser = new DOMParser();

const redditThreadURL = `https://oauth.reddit.com/r/${subreddit}/comments/${threadID}`
const redditMorechildrenURL = `https://oauth.reddit.com/api/morechildren?link_id=t3_${threadID}&children=`
const redditSingleCommentURL = `https://oauth.reddit.com/r/${subreddit}/api/info/?id=`
const pushshiftIDsURL = `https://api.pushshift.io/reddit/submission/comment_ids/${threadID}`
const pushshiftCommentsURL = "https://api.pushshift.io/reddit/comment/search?ids="

const mainDiv = document.getElementById("main")
const loadingText = document.getElementById("loading-text")
const loadingImage = document.getElementById("loading-image")
const loadingImageSrc = "/static/loading.gif"
const doneImageSrc = "/static/done.png"

// I actually haven't found a better way of doing this... 
// Imgur has images-links with no indication that they are actually images
const imageHosts = ["i.redd.it", "flickr.com", "i.imgur.com", "imgur.com", "m.imgur.com"]

const commentIDs = []
const morechildrenIDs = []
const continuethisthreadIDs = []
const maxIDsPerRequest = 100
const commentLookup = new Map()
const commentsToCreate = []
const deletedCommentIDs = []

let totalComments

const redditInit = {
	headers: { "Authorization": "bearer " + token }
}

loadPage()

async function loadPage() {
	
	loadingImage.src = loadingImageSrc
	loadingImage.style.display = "block"
	setLoadingText("Loading thread...")	
	
	// Get thread from reddit and all comment IDs (inc. removed ones) from pushshift
	const requests = [
		fetch(redditThreadURL, redditInit).then(json), 
		fetch(pushshiftIDsURL).then(json)
	]
	
	// Bottleneck here is allways the reddit api
	const [thread, allCommentIDs] = await Promise.all(requests)
	
	generateThread(thread)

	// Get all the comments from the first request
	setLoadingText("Loading comments from reddit...")
	commentIDs.push(...getCommentIDs(thread))
	
	// Recursivly extract all IDs from "show more"-comments
	await getMorechildrenIDs()

	// Do same thing for "continue this thread"-comments
	const smallerThreads = await Promise.all(continuethisthreadIDs.map(id => fetch(redditThreadURL + "/_/" + id.split("_")[1], redditInit).then(json)))
	//const smallerThreadsJson = await Promise.all(smallerThreads.map(x => x.json()))
	smallerThreads.forEach(thread => commentIDs.push(...getCommentIDs(thread)))
	
	setLoadingText("Getting removed comments...")
	const removedComments = await getRemovedComments(allCommentIDs.data)
	
	setLoadingText("Generating comments...")
	await generateComments(removedComments)

	setLoadingText("")
	loadingImage.src = doneImageSrc
}

// ------------------------------------------------------------------------------
// ----------------------- Functions for getting IDs ----------------------------
// ------------------------------------------------------------------------------

function getCommentIDs(thread) {
	return flattenArray(thread[1].data.children.map(extractIDFromComment))
}

function extractIDFromComment(comment) {
	const data = comment.data
	// "Show more"-comments
	if(comment.kind == "more") {			
		if(data.id === "_") {	// = "continue this thread"-comment
			console.log("From thread countinue: "+ data.parent_id)
			continuethisthreadIDs.push(data.parent_id)
		} else if(data.children.length < data.count){ // "Load more"-comment (that is missing some of its children)
			morechildrenIDs.push(data.children)
		}
		return data.children
	}
	// Normal comment
	const repliesIDs = [data.id]

	if(data.replies) {
		data.replies.data.children.forEach(child => repliesIDs.push(...extractIDFromComment(child)))
		delete data.replies
	}
		
	commentLookup.set(data.id, data)
	return repliesIDs
}

async function getMorechildrenIDs() {
	//const responses = await Promise.all(morechildren_ids.map(id_array => fetch(morechildren_url + id_array.join(), reddit_init)))
	const responsesArrays = await Promise.all(morechildrenIDs.map(idArray => fetchMultiple(redditMorechildrenURL, idArray, redditInit)))
	const responses = flattenArray(responsesArrays)
	morechildrenIDs.length = 0
	responses.forEach(extractMorechildrenIDs)
	
	if(morechildrenIDs.length !== 0) {
		await getMorechildrenIDs()
	}
}

function extractMorechildrenIDs(comments) {
	comments.jquery[14][3][0].forEach(comment => {
		if(comment.kind == "more") {
			if(comment.data.id === "_") {
				console.log("From more, continue: " + comment.data.parent_id)
				continuethisthreadIDs.push(comment.data.parent_id)	
			} else {
				const children = comment.data.children

				if(children.length < comment.data.count) {
					morechildrenIDs.push(children)			
				} 
				commentIDs.push(...children)
			}
		} else {
			commentIDs.push(comment.data.id)
			commentLookup.set(comment.data.id, comment.data)
		}
	});
}


async function getRemovedComments(allCommentIDs) {
	let idsDiff = allCommentIDs.filter(x => !commentIDs.includes(x))

	commentIDs.forEach(id =>  {
		if(commentLookup.has(id)) {
			if(commentLookup.get(id).body === "[removed]") {
				idsDiff.push(id)
			} else if (commentLookup.get(id).body === "[deleted]"){
				idsDiff.push(id)
				deletedCommentIDs.push(id)
			}
		}
	})

	idsDiff = [...new Set(idsDiff)]
	
	generateCommentInfo(idsDiff.length)
	console.log("All ids :", allCommentIDs)
	console.log("Comments ids (dup): ", commentIDs)
	console.log("With/without dups: ", commentIDs.length, new Set(commentIDs).size)
	console.log("Difference: ", idsDiff)
	console.log("Lookup size:", commentLookup.size)
	return fetchMultiple(pushshiftCommentsURL, idsDiff, null, ["data"], true)
}


// ------------------------------------------------------------------------------
// ----------------------- Comment generating functions -------------------------
// ------------------------------------------------------------------------------

async function generateComments(removedComments) {
	const commentSection = generateHTML(`<div id="${threadID}"></div>`)
	mainDiv.appendChild(commentSection)
	
	removedComments.forEach(comment => {
		comment["removed"] = true
		commentLookup.set(comment.id, comment)
	})

	const commentsToLookup = removedComments.map(comment => comment.id)	
	await getCommentsToGenerate(commentsToLookup)
	
	commentsToCreate.sort(function(a, b) {
		const aScore = commentLookup.get(a).score
		const bScore = commentLookup.get(b).score
			
		return aScore === bScore ? 0 : (aScore > bScore ? 1 : -1)
	});
	
	createComments()
}

async function getCommentsToGenerate(commentsToLookup) {	
	const newCommentsToLookup = []
	const commentsToFetch = []

	commentsToLookup.forEach(id => {
		const parentID = commentLookup.get(id).parent_id.split("_")[1]

		if(parentID === threadID) {} // Has no parent (is parent of thread)
		else if(commentsToCreate.includes(parentID)) {} // Parent already exists, do nothing
		else if(newCommentsToLookup.includes(parentID))  {} // Parent already exists (this iteration)
		else if(commentLookup.has(parentID)) {
				newCommentsToLookup.push(parentID)
		} else{
			console.error("Comment doesn't exists, but lets try it anyway :D")
			commentsToFetch.push(parentID)
		}

		commentsToCreate.push(id)
	})

	if(commentsToFetch.length !== 0) {
		const newComments = await fetch(redditSingleCommentURL + commentsToFetch.map(x => "t1_" + x).join(), redditInit).then(json)
		console.log(newComments)
		
		newComments.data.children.forEach(x => {
			console.log(x.data.id)
			commentLookup.set(x.data.id, x.data)
			newCommentsToLookup.push(x.data.id)
		})
	}

	if(newCommentsToLookup.length !== 0) {
		await getCommentsToGenerate(newCommentsToLookup)
	}
}

function createComments() {
	const createdCommentIDs = [threadID]
	let id, parentID
	let didSomething

	while(commentsToCreate.length > 0) {
		didSomething = false

		for(let i = commentsToCreate.length -1; i >= 0; i--) {
			id = commentsToCreate[i]
			parentID = commentLookup.get(id).parent_id.split("_")[1]

			if(createdCommentIDs.includes(parentID)) {
				document.getElementById(parentID).appendChild(createComment(commentLookup.get(id)))
				createdCommentIDs.push(id)
				commentsToCreate.splice(i, 1)
				didSomething = true
			}
		}

		// Fail safe (parents missing for all comments left, should happend but oh well :D)
		if(!didSomething) {
			console.error("Didn't generate all comments correctly")
			break
		}
	}
}
// ------------------------------------------------------------------------------
// ------------------------- HTML-generating functions --------------------------
// ------------------------------------------------------------------------------

function generateThread(data) {
	const thread = data[0].data.children[0].data
	totalComments = thread.num_comments
	
	const threadDiv = document.createElement("div")
	threadDiv.id = "thread"
	threadDiv.innerHTML  = `
		<div id="thread">
			<div id="thread-score-box">
				<div class="vote upvote"></div>
				<div id="thread-score">${prettyScore(thread.score)}</div>
				<div class="vote downvote"></div>
			</div>
			<div id="thumbnail"></div>
			<div id="thread-content">
				${thread.link_flair_text !== null ? '<span class="link-flair">'+thread.link_flair_text+'</span>' : ''}
				<a id="thread-title" href="${thread.url}">${thread.title}</a>
				<span id="domain">(${thread.domain})</span>
				<div id="thread-info">
					submitted <span id="thread-time">${prettyDate(thread.created_utc)}</span> by 
					<a id="thread-author" class="user-link" href="https://www.reddit.com/user/${thread.author}">${thread.author}</a> to 
					<a id="subreddit-link" class="user-link" href="https://reddit.com/r/${subreddit}">/r/${subreddit}</a>
				</div>
				${thread.selftext !== '' ? '<div id="thread-selftext" class="user-text">'+markdown.render(thread.selftext)+'</div>':''}
				<div id="total-comments"><b>${totalComments} comments</b></div>
				${thread.media !== null ? parseHTML(thread.media_embed.content) : ''}
				${imageHosts.includes(thread.domain) && thread.hasOwnProperty("preview") ? '<a href="'+thread.url+'"><img id="thread-image" src="'+thread.preview.images[0].source.url+'"></a>' : ''}
			</div>
		</div>
	`
	mainDiv.appendChild(threadDiv)
}
function createComment(comment) {
	const isDeleted = deletedCommentIDs.includes(comment.id)
	const isRemoved = comment.hasOwnProperty("removed")

	return generateHTML(`
		<div id="${comment.id}" class="comment comment-${isRemoved  ? "removed" :  (comment.depth % 2 == 0 ? "even" : "odd")}">
			<div class="comment-head">
				<a href="javascript:void(0)" class="user-link">[–]</a>
				<a href="https://www.reddit.com/user/${comment.author}" class="user-link comment-author">${comment.author}${isDeleted ? " (user deleted this comment)" : ""}</a>
				<span class="comment-score">${prettyScore(comment.score)} point${(comment.score == 1) ? '': 's'}</span>
				<span class="comment-time">${prettyDate(comment.created_utc) }</span>
			</div>
			<div class="comment-body">${comment.body === "[removed]" && isRemoved ? "<p>[likely removed by automoderator]</p>" : markdown.render(comment.body)}</div>
			<div class="comment-links">
				<a href="https://todo.com">permalink</a>
			</div>
		</div>
	`)
}

function generateCommentInfo(removedCommentsAmount) {
	mainDiv.appendChild(generateHTML(`
		<div>
			<div id="comment-info">
				removed comments: ${removedCommentsAmount}/${totalComments} (${ (100 * removedCommentsAmount / totalComments).toFixed(1)}%)
			</div>
			<div id="comment-sort">sorted by: top</div>
		</div>
	`))
}

// Works for everything except iframes/script-tags, use "old fashion"-way in those cases (createElement etc...)
function generateHTML(html) {
	return htmlParser.parseFromString(html, "text/html").body.firstChild
}

// "&lt;" => "<"
function parseHTML(html) {
	const dummy = document.createElement('div')
	dummy.innerHTML = html
	return dummy.childNodes.length === 0 ? "" : dummy.childNodes[0].nodeValue;
}


// ------------------------------------------------------------------------------
// ----------------------------- AJAX-functions ---------------------------------
// ------------------------------------------------------------------------------

async function fetchMultiple(url, data, init, jsonWalkdown=[], flattening=false) {
	const responses = await Promise.all(splitArray(data, maxIDsPerRequest).map(singleRequestData => fetch(url + singleRequestData.join(), init)))
	let json = await Promise.all(responses.map(x => x.json()))
	jsonWalkdown.forEach(property =>{
		json.forEach((x, i) => json[i] = json[i][property])
	})
	return flattening ? flattenArray(json) : json
}

// ------------------------------------------------------------------------------
// ---------------------- Other less interesting functions ----------------------
// ------------------------------------------------------------------------------

function splitArray(array, size) {
	const arraySplit = []
	
	for(let i = 0, len = array.length ; i < len; i += size) {
		arraySplit.push(array.slice(i, i + size))
	}

	return arraySplit
}

function flattenArray(arrays) {
	return arrays.reduce((array, item) => { return array.concat(item) }, [])
}

function setLoadingText(text) {
	loadingText.innerHTML = text 
}

function json(x) {
	return x.json()
}

// UTC -> "Reddit time format" (5 hours ago, just now, etc...)
function prettyDate(createdUTC) {
	const currentUTC = Math.floor((new Date()).getTime() / 1000)
	const secondDiff = currentUTC - createdUTC
	const dayDiff = Math.floor(secondDiff / 86400) 
	
	if(dayDiff < 0)
		return ''

	if(dayDiff == 0) {
		if(secondDiff < 10)
			return "just now"
		if(secondDiff < 60)
			return secondDiff + " seconds ago"
		if(secondDiff < 120)
			return "a minute ago"
		if(secondDiff < 3600)
			return Math.floor(secondDiff / 60) + " minutes ago"
		if(secondDiff < 7200)
			return "an hour ago"
		if(secondDiff < 86400)
			return Math.floor(secondDiff / 3600) + " hours ago"
	}
	//if(dayDiff == 1)
	//	return "Yesterday"
	if(dayDiff < 7)
		return dayDiff + " days ago"
	if(dayDiff < 31)
		return Math.floor(dayDiff / 7) + " weeks ago"
	if(dayDiff < 365)
		return Math.floor(dayDiff / 30) + " months ago"
	return Math.floor(dayDiff / 365) + " years ago"
}

// 12000 => 1.2k
function prettyScore(score) {
	return score >= 10000 ? (score / 1000).toFixed(1) + "k" : score
}