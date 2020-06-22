const express = require("express");
const https = require("https");
const { parse } = require("node-html-parser");

const app = express();

const _baseUrl = "https://www.kickassanime.rs/";
const _error = "ERROR";

function getJsonError(errorMessage) {
  return {
    status: _error,
    message: errorMessage,
  };
}

function getRawJson(responseBody) {
  var root = parse(responseBody, {
    script: true,
  });
  var scripts = root.querySelectorAll("script");

  var appDataScript = scripts.find((script) =>
    script.rawText.includes("appData")
  );

  var jsonResponse = appDataScript
    .toString()
    .split(" appData = ")[1]
    .split(" || {}")[0];

  return JSON.parse(jsonResponse);
}

// base query api - for querying about for an anime name
app.get("/api/query=:query", (req, res) => {
  const url = `${_baseUrl}search?q=${req.params.query}`;

  https
    .get(url, (response) => {
      var body = [];

      response.on("data", (chunk) => body.push(chunk));

      response.on("end", () => {
        body = Buffer.concat(body).toString();

        const jsonResponse = getRawJson(body);

        res.send(jsonResponse.animes);
      });
    })
    .on("error", (err) => {
      res.send(getJsonError(err.toString()));
    });
});

// get details on a particular anime
app.get("/api/anime/:animeName", (req, res) => {
  const url = `${_baseUrl}/anime/${req.params.animeName}`;

  https
    .get(url, (response) => {
      var body = [];

      response.on("data", (chunk) => body.push(chunk));

      response.on("end", () => {
        body = Buffer.concat(body).toString();

        const jsonResponse = getRawJson(body);

        res.send(jsonResponse.anime);
      });
    })
    .on("error", (err) => {
      res.send(getJsonError(err.toString()));
    });
});

app.listen(3000, () => console.log("Listening at port 3000"));
