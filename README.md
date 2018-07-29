# Removeddit
[Removeddit](https://removeddit.com) is a site for viewing removed comments / threads from [Reddit](https://www.reddit.com).
Just go to any reddit thread and change the `reddit` in the URL to `removeddit` to see all removed comments.

This is a done by comparing the comments being stored in [Jason Baumgartners](https://pushshift.io/) [Pushshift Reddit API](https://github.com/pushshift/api) and the ones from Reddit API. The frontend is written in React and uses Sass as the CSS Preprocessor. There is also a seperate [backend](https://github.com/JubbeArt/removeddit-api) used for storing what threads that have been removed by mods.

# Development
Download either [Yarn](https://yarnpkg.com/en/docs/install) (the one I use) or [npm](https://www.npmjs.com/get-npm) 

```bash
sudo git clone https://github.com/JubbeArt/removeddit.git && cd removeddit

# npm...
npm install
npm start

# or yarn
yarn
yarn start
```

This will build the Javascript files and launch a local server for development. Visit http://localhost:8080 and make sure the site is running.

The CSS is build seperatly (to keep the build steps / configs very simple) by running
```bash
# npm
npm run build-sass

# yarn
yarn run build-sass
```

## Linting
The linter I use is called [standard](https://standardjs.com/) and you can find plugins for different editors [here](https://standardjs.com/#are-there-text-editor-plugins). Currently I'm using VSCode.