const express = require("express");
const https = require("https");
const { parse } = require("node-html-parser");
const { json } = require("express");

const app = express();

const _baseUrl = "https://www.kickassanime.rs/";
const _error = "ERROR";

// utility function for buliding JSON structured error
function getJsonError(errorMessage) {
  return {
    status: _error,
    message: errorMessage,
  };
}

function getLinkFromIFrame(iFrameUrl) {
  return new Promise((resolve, reject) => {
    https
      .get(iFrameUrl, (res) => {
        var body = [];
        res.on("data", (c) => body.push(c));

        res.on("end", () => {
          body = Buffer.concat(body).toString();
          const root = parse(body, {
            script: true,
          });

          const scripts = root.querySelectorAll("script");
          const script = scripts.find((s) =>
            s.rawText.includes("document.write(atob")
          );

          const base64html = script.rawText.split('"')[1].split('"')[0];
          const r = parse(Buffer.from(base64html, "base64").toString());
          const anchors = r.querySelectorAll("a");
          const anchor720p = anchors.find((a) => a.rawText.includes("720p"));

          resolve(
            `https://haloani.ru/Kickassanimev2/${anchor720p.rawAttributes.href}`
          );
        });
      })
      .on("error", (err) => reject(err));
  });
}

function getBackupPlayableUrl(mobile2Link) {
  return new Promise((resolve, reject) => {
    https
      .get(mobile2Link, (rep) => {
        var body = [];

        rep.on("data", (c) => body.push(c));

        rep.on("end", () => {
          body = Buffer.concat(body).toString();

          const root = parse(body);
          const iFrame = root.querySelector("#idl-item");
          const iFrameUrl = iFrame.rawAttributes.src;

          getLinkFromIFrame(iFrameUrl)
            .then((url) => resolve(url))
            .catch((err) => reject(err));
        });
      })
      .on("error", (err) => reject(err));
  });
}

// utility method for converting haloani url to mp4 playable url
function getPlayableUrl(serverUrl) {
  return new Promise((resolve, reject) => {
    const url = `https:${decodeURIComponent(serverUrl.split("&data=")[1])}`;

    https
      .get(url, (rep) => {
        var body = [];

        rep.on("data", (c) => body.push(c));

        rep.on("end", () => {
          body = Buffer.concat(body).toString();

          const root = parse(body, {
            script: true,
          });
          const scripts = root.querySelectorAll("script");
          const s = scripts.find((s) =>
            s.rawText.includes("playerInstance.setup")
          );
          const mp4url = s.rawText
            .toString()
            .replace("'", "")
            .split("sources:[{file: ")[1]
            .split(",label: 'HD P','type' : 'mp4'}]")[0];

          resolve(mp4url);
        });
      })
      .on("error", (err) => reject(err));
  });
}

function getRawJson(responseBody) {
  const root = parse(responseBody, {
    script: true,
  });
  const scripts = root.querySelectorAll("script");

  const appDataScript = scripts.find((script) =>
    script.rawText.includes("appData")
  );

  const jsonResponse = appDataScript
    .toString()
    .split(" appData = ")[1]
    .split(" || {}")[0];

  return JSON.parse(jsonResponse);
}

// base query api - for querying about for an anime name
app.get("/api/:query", (req, res) => {
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
    .on("error", (err) => res.send(getJsonError(err.toString())));
});

// get details on a particular anime
app.get("/api/anime/:animeID", (req, res) => {
  const url = `${_baseUrl}/anime/${req.params.animeID}`;

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
    .on("error", (err) => res.send(getJsonError(err.toString())));
});

// get details regarding a particular episode - and get anime playable URL
app.get("/api/anime/:animeID/:episodeID", (req, res) => {
  const url = `${_baseUrl}/anime/${req.params.animeID}/${req.params.episodeID}`;

  https
    .get(url, (response) => {
      var body = [];

      response.on("data", (chunk) => body.push(chunk));

      response.on("end", () => {
        body = Buffer.concat(body).toString();

        const jsonResponse = getRawJson(body);

        return res.send(jsonResponse);

        try {
          const extServers = jsonResponse.ext_servers;
          const vidstreamingService = extServers.find(
            (s) => s.name === "Vidstreaming"
          );

          getPlayableUrl(vidstreamingService.link)
            .then((link) => {
              res.send({
                anime: jsonResponse.anime,
                episode: jsonResponse.episode,
                playableLink: link,
                episodes: jsonResponse.episodes,
              });
            })
            .catch((e) => {
              res.send(getJsonError(e.toString()));
            });
        } catch (e) {
          const links = [
            jsonResponse.episode.link1,
            jsonResponse.episode.link2,
            jsonResponse.episode.link3,
            jsonResponse.episode.link4,
          ];

          const mobile2Link = links.find((l) =>
            l.toString().includes("mobile2")
          );
          if (mobile2Link) {
            getBackupPlayableUrl(mobile2Link)
              .then((link) => {
                res.send({
                  anime: jsonResponse.anime,
                  episode: jsonResponse.episode,
                  playableLink: link,
                  episodes: jsonResponse.episodes,
                });
              })
              .catch((e) => {
                res.send(getJsonError(e.toString()));
              });
            return;
          }
        }
      });
    })
    .on("error", (err) => res.send(getJsonError(err.toString())));
});

app.listen(3000, () => console.log("Listening at port 3000"));
