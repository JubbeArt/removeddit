from flask import Flask, abort, request, render_template
import urllib.parse
import requests
import requests.auth
import datetime

import json

APP_NAME		= 'TEST'
USERNAME		= 'Jubbeart'
VERSION			= '0.1'

CLIENT_ID  		= ''
CLIENT_SECRET 	= ''
USER_AGENT		= 'Javascript:{}:v{} (by /u/{})'.format(APP_NAME, VERSION, USERNAME)

TOKEN_URL 		= 'https://www.reddit.com/api/v1/access_token'
API_URL			= 'https://oauth.reddit.com/'
COMMENT_IDS_URL = 'https://api.pushshift.io/reddit/submission/comment_ids/{}'
COMMENTS_URL 	= 'https://api.pushshift.io/reddit/comment/search?ids={}'

FILTER_BODY = [
	'title', 		'author',	'num_comments',
	'subreddit',	'score', 	'upvote_ratio',
	'created_utc',	'locked',	'link_flair_text',
	'is_self',		'url',		'selftext_html',
	'id'
]

FILTER_COMMENT = [
	'score',		'author',	'created_utc',	
	'body_html',	'id',		'controversiality',
	
	'collapsed_reason', 'collapsed',
]
	
app = Flask(__name__)
	
@app.route('/')
def homepage():
	return render_template('frontpage.html')


@app.route('/r/<string:subreddit>/comments/<path:thread_id>')
def thread(subreddit, thread_id):
	thread_id = thread_id.split('/')[0]
	comment_ids = requests.get(COMMENT_IDS_URL.format(thread_id)).json()["data"]	
	token = get_token()
	
	return render_template(
		'thread.html', 
		token=token, 
		comment_ids=comment_ids,
		thread_id=thread_id,
		subreddit=subreddit
	)
	
@app.route('/comments/')
def comments():
	ids = None

	try:
		ids = request.args.get('c')
	except:
		return ''
		
	if ids:		
		return requests.get(COMMENTS_URL.format(ids)).content
	else:
		return ''
	
	
def get_token(old_token=None):
	post_data = {'grant_type': 'client_credentials'}
	headers = {'User-Agent': USER_AGENT}	
	client_auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
	response = requests.post(
		TOKEN_URL, 
		auth=client_auth,
		data=post_data,
		headers=headers
	)
	return response.json()['access_token']

if __name__ == '__main__':
	app.run(debug=True, port=65010)
