# movi-api

#### The movi-api can be found [here](https://movi-api.cloudno.de/)

The anime API build by scraping [kickassanime](https://www1.kickassanime.rs)!
This app build with Node.js, scrapes the anime website (here, kickassanime) to fetch you a simple API for quering anime names, seasons and episodes. The API also exposes you the direct playable video URL.

## Features
- API built scraping a website, thus up-to-date data.
- Instead of always crawling the website, the app caches the already searched contents upto 1 day, thus improving the response time.
- A programmable interface for querying animes and episodes

## Getting Started
#### You need to setup mongoDB server and set the localhost url to an environment variable named mongodb
- Clone the repo from `https://www.github.com/jyotirmoy-paul/movi`
- Head to the folder movi-api and run `npm install` to install the dependencies
- Run `node app.js` to start up the server
- You can now start visiting any of the endpoints

## API Documentation
Base URL for all endpoints `https://movi-api.cloudno.de/api/`
The API is hosted on [cloudno.de](https://www.cloudno.de). The latency might be high as there are no intermediate CDNs present.

#### Endpoints
- `/query/{anime-name}` Retrieve all the animes present, matching the query {anime-name}
- `/anime/{anime-ID}` Retrieve all the episodes for the anime recognized by anime-ID
- `/anime/{anime-ID}/{episode-id}` Retrieve the episode details, along with a direct playable url (if possible)



