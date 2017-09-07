# Removeddit
[Removeddit](https://removeddit.com) is a site for viewing removed comments from [Reddit](https://www.reddit.com).
Usage: go to any reddit thread and change the "reddit" in the URL to "removeddit".
The site will only display the removed comments and thier parents, not the full thread.

This is a done by comparing the comments found from Reddit API and comments from [Jason Baumgartners](https://pushshift.io/) [Pushshift Reddit API](https://github.com/pushshift/api). The backend of the site is written in Go and frontend with JavaScript (ES6). You can use this content however you want, as long as it's non-commercial.

# Quick start
Install [Go](https://golang.org/) and [this](https://godoc.org/golang.org/x/crypto/acme/autocert) Go package with:

```go get golang.org/x/crypto/acme/autocert```

(Note: if you only want to have a local server you could remove all references to this package in *server.go* and it should work if you run it with the *-d* flag)

Create a reddit web app [here](https://www.reddit.com/prefs/apps/). 

Open *secret.go* and fill out all the variables:
```go 
const (
	appName      = "Name of your reddit web app"
	userName     = "Reddit username"
	clientID     = "Go to the link above and check the string under 'web app'"
	clientSecret = "Go to the link above, click the 'edit' link and you'll see the secret"
	version      = "The version of your reddit web app, doesn't really matter, use e.g. '1.0'"
	hostname     = "The hostname of your server in production. Not used if you run locally"
)
```

And everything should be set up. Now just build the project with:

```go build server.go secret.go```

And run the program:

```./server```

(just `server` in Windows)

If you want to run it this server on localhost use the *d* flag:

```./server -d```
