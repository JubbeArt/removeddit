pug -P -o . pug/about.pug pug/thread.pug pug/subreddit.pug pug/search.pug
sass --sourcemap=none --style expanded sass/main.sass static/css/style.css

#pug --watch -P -o . pug/about.pug pug/thread.pug pug/subreddit.pug pug/search.pug
#sass --watch --sourcemap=none --style expanded sass/main.sass:static/css/style.css