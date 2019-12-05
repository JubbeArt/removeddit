# Removeddit
[Removeddit](https://removeddit.com) is a site for viewing removed comments / threads from [Reddit](https://www.reddit.com).
Just go to any reddit thread and change the `reddit` in the URL to `removeddit` to see all removed comments.

This is a done by comparing the comments being stored in [Jason Baumgartners](https://pushshift.io/) [Pushshift Reddit API](https://github.com/pushshift/api) and the ones from Reddit API. The frontend is written in [React](https://reactjs.org/) and uses [Sass](https://sass-lang.com/) as the CSS Preprocessor. There is also a seperate [backend](https://github.com/JubbeArt/removeddit-api) used for storing what threads that have been removed by mods. This backend is really just a mirror of [/r/undelete](https://www.reddit.com/r/undelete/).

# Development
Download [npm](https://www.npmjs.com/get-npm) 

```bash
git clone https://github.com/JubbeArt/removeddit.git && cd removeddit

npm install
npm start
```

This will build the Javascript files and launch a local server for development. Visit http://localhost:8080 and make sure the site is running. If you're getting connection errors to Reddit or Pushshift, it might be because you're running a VPN. Try turning it off for development.

The CSS is build seperatly (to keep the build steps / configs very simple) by running
```bash
npm run build-sass
```
