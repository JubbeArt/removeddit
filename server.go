package main

import (
	"crypto/tls"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"golang.org/x/crypto/acme/autocert"
)

// consts
const (
	userAgent  = "Javascript:" + appName + ":" + version + "s (by /u/" + userName + ")"
	tokenURL   = "https://www.reddit.com/api/v1/access_token"
	tmplFolder = "templates/"
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

type threadPageData struct {
	Token      string
	Subreddit  string
	ThreadID   string
	CommentIDs []string
}

func main() {
	initLogging()
	accessLog.Println("Staring server")

	var debugMode bool
	flag.BoolVar(&debugMode, "d", false, "debug mode: run the server on localhost")
	flag.Parse()

	http.HandleFunc("/", pageHandler(mainHandler))
	http.HandleFunc("/r/", pageHandler(threadHandler))

	// Serve static files, in production use cdn.rawgit.com (nvm fuck this, always serve static)
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Run locally for debugging/testing
	if debugMode {
		fmt.Println("Starting server on http://localhost:8080")

		if err := http.ListenAndServe(":8080", nil); err != nil {
			log.Fatalf("Could not start server: %v", err)
		}
	} else { // Run in production
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist(hostname, "www."+hostname),
			Cache:      autocert.DirCache("certs"),
		}

		server := &http.Server{
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 10 * time.Second,
			TLSConfig: &tls.Config{
				GetCertificate: certManager.GetCertificate,
			},
			ErrorLog: errorLog,
		}

		redirect := &http.Server{
			ReadTimeout:  10 * time.Second,
			WriteTimeout: 10 * time.Second,
			Handler:      http.HandlerFunc(redirectTLS),
		}

		go func() {
			if err := redirect.ListenAndServe(); err != nil {
				log.Fatalf("Could not start redirect server: %v", err)
			}
		}()

		if err := server.ListenAndServeTLS("", ""); err != nil {
			log.Fatalf("Could not start server with SSL/TLS Certificate: %v", err)
		}
	}

	log.Println("Shutting down server")
}

func initLogging() {
	accessFile, _ := os.OpenFile("access.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	errorFile, _ := os.OpenFile("error.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)

	accessLog = log.New(accessFile, "", log.Ldate|log.Ltime|log.Lshortfile)
	errorLog = log.New(errorFile, "", log.Ldate|log.Ltime|log.Lshortfile)
}

// Wrap page handle function for the access log
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

func handleError(w http.ResponseWriter, msg string) {
	renderTemplate(w, "error", msg)
	errorLog.Println(msg)
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

	token, err := getAPIToken()
	if err != nil {
		handleError(w, err.Error())
		return
	}

	data := &threadPageData{
		Token:     token,
		Subreddit: pathParts[2],
		ThreadID:  pathParts[4],
	}

	renderTemplate(w, "thread", data)
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

func redirectTLS(w http.ResponseWriter, r *http.Request) {
	http.Redirect(w, r, fmt.Sprintf("https://www.%s/%s", hostname, r.RequestURI), http.StatusMovedPermanently)
}
