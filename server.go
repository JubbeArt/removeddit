package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// consts
const (
	userAgent     = "Javascript:" + appName + ":" + version + "s (by /u/" + userName + ")"
	tokenURL      = "https://www.reddit.com/api/v1/access_token"
	commentIDsURL = "https://api.pushshift.io/reddit/submission/comment_ids/"
	commentsURL   = "https://api.pushshift.io/reddit/comment/search?ids="
	tmplFolder    = "templates/"
	errorHTML     = "<h3 style=\"colorError;font-family: verdana, arial, helvetica, sans-serif;\">Error: %s</h3>"
)

var (
	client    = &http.Client{Timeout: time.Second * 10}
	tokenData = url.Values{"grant_type": []string{"client_credentials"}}
	templates = template.Must(template.ParseFiles(
		tmplFolder+"header.html",
		tmplFolder+"footer.html",
		tmplFolder+"thread.html",
		tmplFolder+"frontpage.html",
		tmplFolder+"error.html",
	))

	accessLog *log.Logger
	errorLog  *log.Logger
)

type tokenResponse struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
	ExpiresIn   int    `json:"expires_in"`
	Scope       string `json:"scope"`
}

type pushshiftAPI struct {
	Data []string `json:"data"`
}

type pageData struct {
	Token      string
	Subreddit  string
	ThreadID   string
	CommentIDs []string
}

func main() {
	initLogging()
	accessLog.Println("Staring server")
	/*
		s := &http.Server{
		Addr:           ":8080",
		Handler:        myHandler,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}*/

	// Only serve local static files for debugging, otherwise use cdn.rawgit.com
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	http.HandleFunc("/", pageHandler(mainHandler))
	http.HandleFunc("/r/", pageHandler(threadHandler))
	http.HandleFunc("/comments/", pageHandler(commentHandler))

	http.ListenAndServe(":9000", nil)
}

func initLogging() {
	accessFile, _ := os.OpenFile("access.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	errorFile, _ := os.OpenFile("error.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)

	accessLog = log.New(accessFile, "", log.Ldate|log.Ltime|log.Lshortfile)
	errorLog = log.New(errorFile, "", log.Ldate|log.Ltime|log.Lshortfile)
}

// Wrap handle function for the access log
func pageHandler(fn func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		accessLog.Println(r.URL.Path)
		fn(w, r)
	}
}

func renderTemplate(w http.ResponseWriter, pageName string, data interface{}) {
	templates.ExecuteTemplate(w, "header.html", nil)
	templates.ExecuteTemplate(w, pageName+".html", data)
	templates.ExecuteTemplate(w, "footer.html", nil)
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	renderTemplate(w, "frontpage", nil)
}

func threadHandler(w http.ResponseWriter, r *http.Request) {
	pathParts := strings.Split(r.URL.Path, "/")

	if len(pathParts) < 5 {
		handleError(w, "Missing necessary parts of the URL")
		return
	}

	resp, _ := client.Get(commentIDsURL + pathParts[4])
	if resp.StatusCode != 200 {
		handleError(w, "Trouble getting removed comments from pushshift")
		return
	}

	token, err := getAPIToken()
	if err != nil {
		handleError(w, err.Error())
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	var dataStructure pushshiftAPI
	json.Unmarshal(body, &dataStructure)

	data := &pageData{
		Token:      token,
		Subreddit:  pathParts[2],
		ThreadID:   pathParts[4],
		CommentIDs: dataStructure.Data,
	}

	renderTemplate(w, "thread", data)
}

func handleError(w http.ResponseWriter, msg string) {
	renderTemplate(w, "error", msg)
	errorLog.Println(msg)
}

func commentHandler(w http.ResponseWriter, r *http.Request) {
	commentIDs := r.FormValue("c")
	if commentIDs == "" {
		handleError(w, "Not enough arguments provided")
		return
	}

	resp, err := client.Get(commentsURL + commentIDs)

	if err != nil {
		handleError(w, "Trouble getting removed comments from pushshift")
		return
	}

	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Fprintf(w, string(body))
}

func getAPIToken() (string, error) {
	req, _ := http.NewRequest("POST", tokenURL, strings.NewReader(tokenData.Encode()))
	req.Header.Add("User-Agent", userAgent)
	req.SetBasicAuth(clientID, clientSecret)

	resp, err := client.Do(req)
	if err != nil {
		return "", errors.New("Coulnd't get API token from Reddit")
	}
	defer resp.Body.Close()
	body, _ := ioutil.ReadAll(resp.Body)
	var r tokenResponse
	json.Unmarshal(body, &r)
	return r.AccessToken, nil
}
