const express = require("express");
const AnimeService = require("./services/animeService");

const app = express();
const _error = "ERROR";

// utility function for buliding JSON structured error
function getJsonError(errorMessage) {
  return {
    status: _error,
    message: errorMessage,
  };
}

// base query api - for querying about for an anime name
app.get("/api/query/:query", (req, res) => {
  const query = req.params.query;

  AnimeService.queryAnimeBy(query)
    .then((jsonResponse) => res.send(jsonResponse))
    .catch((err) => res.send(getJsonError(err)));
});

// get details on a particular anime
app.get("/api/anime/:animeID", (req, res) => {
  const animeID = req.params.animeID;

  AnimeService.queryAnimeDetails(animeID)
    .then((jsonResponse) => res.send(jsonResponse))
    .catch((err) => res.send(getJsonError(err)));
});

// get details regarding a particular episode - and get anime playable URL
app.get("/api/anime/:animeID/:episodeID", (req, res) => {
  const { animeID, episodeID } = req.params;

  AnimeService.queryEpisodeDetails(animeID, episodeID)
    .then((jsonResponse) => res.send(jsonResponse))
    .catch((err) => res.send(getJsonError(err)));
});

app.listen(3000, () => console.log("Listening at port 3000"));
