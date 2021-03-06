const express = require("express");
const path = require("path");

const AnimeService = require("./services/animeService");
const CacheService = require("./services/cacheService");

new CacheService(); // start up the cache service
const _error = "ERROR";

const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// utility function for buliding JSON structured error
function getJsonError(errorMessage) {
  return {
    status: _error,
    message: errorMessage,
  };
}

function sendResponse(res, data) {
  res.setHeader("API-Info", "Anime Api v1.0.0 (http://moviapi.cloudno.de/)");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "GET");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Connection", "close");

  res.send(data);
}

// base query api - for querying about for an anime name
app.get("/api/query/:query", (req, res) => {
  const query = req.params.query;

  AnimeService.queryAnimeBy(query)
    .then((jsonResponse) => sendResponse(res, jsonResponse))
    .catch((err) => sendResponse(res, err));
});

// get details on a particular anime
app.get("/api/anime/:animeID", (req, res) => {
  const animeID = req.params.animeID;

  AnimeService.queryAnimeDetails(animeID)
    .then((jsonResponse) => sendResponse(res, jsonResponse))
    .catch((err) => sendResponse(res, getJsonError(err)));
});

// get details regarding a particular episode - and get anime playable URL
app.get("/api/anime/:animeID/:episodeID", (req, res) => {
  const { animeID, episodeID } = req.params;

  AnimeService.queryEpisodeDetails(animeID, episodeID)
    .then((jsonResponse) => sendResponse(res, jsonResponse))
    .catch((err) => sendResponse(res, getJsonError(err)));
});

app.listen(process.env.app_port || 3000, () => console.log("Server started"));
