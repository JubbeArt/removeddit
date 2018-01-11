import clientID from './clientID'
import {json} from 'utils'

// Reddit API
const init = {
	headers: {
		'Authorization': ''
	}
}

let hasToken = false

const tokenInit = {
	headers: {
		'Authorization': 'Basic ' + btoa(clientID + ':'),
		'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
	},
	method: 'POST',
	body: 'grant_type='+encodeURIComponent('https://oauth.reddit.com/grants/installed_client')+'&device_id=DO_NOT_TRACK_THIS_DEVICE'
}

const fetchToken = () => {
	if(hasToken) {
		return Promise.resolve()
	}

	return fetch('https://www.reddit.com/api/v1/access_token', tokenInit)
	.then(json)
	.then(json => {
		init.headers.Authorization = 'bearer ' + json.access_token;
		hasToken = true
	})
}

export default {
	comments(subreddit, threadID) {
		return fetchToken()
	}
	
}