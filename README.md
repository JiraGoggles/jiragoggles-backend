# Jira Goggles
[![Build Status](https://travis-ci.org/JiraGoggles/jiragoggles-backend.svg?branch=master)](https://travis-ci.org/JiraGoggles/jiragoggles-backend)

After cloning the repo type in the console:
```r
npm install
```
after the dependencies have been installed, type:

```r
npm run grunt
```
Grunt will watch for changes in Typescript files located in /src and compile/transpile them automatically.
Now open another console and type the following command if you're on Linux:

```r
npm run dev
```
or this one if you're on Windows:

```r
npm run win-dev
```

This, in turn, will watch for changes in Javascript files located in the root directory and, if there have been any, restart the server in the development mode.
If you want to run the server in the production mode, substitute the word 'dev' in the commands above with the word 'prod'.

Finally, open another console and type:

```r
ngrok http 3000
```

This will make your server publicly available. Copy the url address from ngrok's output (the one that starts with 'https://'). Now open /config.json and replace the existing 'localBaseUrl' address with the one you've just copied. At this point you're ready to upload the add-on to your Jira Cloud instance. While uploading it, point to the 'atlassian-connect.json' file so that Jira can gather necessary information about the add-on and exchange confidential data with the server.

The uploading itself is a one time process. After the data has been exchanged, it's then stored in /store.db and it's easily accessible thereafter. If you're in the development mode you can access any endpoint that has been exposed by the backend without any authentication. The list of available endpoints is included below and will be updated accordingly.

##Available endpoints
###TODO
