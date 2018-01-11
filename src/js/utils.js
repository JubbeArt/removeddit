import SnuOwnd from 'libraries/snuownd.js'

const markdown = SnuOwnd.getParser()

// Default thumbnails for reddit threads
export const redditThumbnails = ['self', 'default', 'image', 'nsfw']

// Images for the status box in right side of header
export const statusImages = {
	loading: '/images/loading.gif',
	error: '/images/error.png',
	success: '/images/done.png'
}

// JSON parsing for fetch
export const json = x => x.json()

// Parse comments
export const parse = text => {
	return markdown.render(text)
}

// UTC -> "Reddit time format" (e.g. 5 hours ago, just now, etc...)
export const prettyDate = createdUTC => {
	const currentUTC = Math.floor((new Date()).getTime() / 1000)
	const secondDiff = currentUTC - createdUTC
	const dayDiff = Math.floor(secondDiff / 86400)
	
	if(dayDiff < 0)	return ""
	if(dayDiff == 0) {
		if(secondDiff < 10)		return "just now"
		if(secondDiff < 60)		return secondDiff + " seconds ago"
		if(secondDiff < 120)		return "a minute ago"
		if(secondDiff < 3600)	return Math.floor(secondDiff / 60) + " minutes ago"
		if(secondDiff < 7200)	return "an hour ago"
		if(secondDiff < 86400)	return Math.floor(secondDiff / 3600) + " hours ago"
	}
	if(dayDiff < 7)	return dayDiff + " days ago"
	if(dayDiff < 31)	return Math.floor(dayDiff / 7) + " weeks ago"
	if(dayDiff < 365)	return Math.floor(dayDiff / 30) + " months ago"
	return Math.floor(dayDiff / 365) + " years ago"
}

// Reddit format for scores, e.g. 12000 => 12k
export const prettyScore = score => {
	if(score >= 100000) {
		return (score / 1000).toFixed(0) + "k"
	} else if(score >= 10000) {
		return (score / 1000).toFixed(1) + "k"
	}

	return  score
}