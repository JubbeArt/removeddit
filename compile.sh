pug -P -o . pug/about.pug pug/thread.pug pug/subreddit.pug pug/search.pug
sass --sourcemap=none --style expanded sass/main.sass static/css/style.css
lodash include=defaultTo,toLower,includes,parseInt,has,isNil,uniq,property,map,forEach,join,sortBy,get,now,template -p -o static/js/libraries/lodash.custom.min.js 
lodash template="jst/*.jst" -p -o static/js/libraries/lodash.templates.min.js

#pug --watch -P -o . pug/about.pug pug/thread.pug pug/subreddit.pug pug/search.pug
#sass --watch --sourcemap=none --style expanded sass/main.sass:static/css/style.css