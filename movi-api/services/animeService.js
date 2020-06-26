const { parse } = require("node-html-parser");

const Networking = require("./networking");
const StreamService = require("./streamService");

const baseUrl = "https://www1.kickassanime.rs/";

class AnimeService {
  // method for converting html body to appData json object
  static getRawJson(responseBody) {
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

  static queryAnimeBy(searchedQuery) {
    const url = `${baseUrl}search?q=${searchedQuery}`;

    return new Promise((resolve, reject) => {
      Networking.getResponse(url, true)
        .then((response) => resolve(this.getRawJson(response).animes))
        .catch((err) => reject(err));
    });
  }

  static queryAnimeDetails(animeID) {
    const url = `${baseUrl}/anime/${animeID}`;

    return new Promise((resolve, reject) => {
      Networking.getResponse(url, true)
        .then((response) => resolve(this.getRawJson(response).anime))
        .catch((err) => reject(err));
    });
  }

  static getJsonObjectWithPlayableLink(jsonResponse, link) {
    return {
      anime: jsonResponse.anime,
      episode: jsonResponse.episode,
      playableLink: link,
      episodes: jsonResponse.episodes,
    };
  }

  static queryEpisodeDetails(animeID, episodeID) {
    const url = `${baseUrl}/anime/${animeID}/${episodeID}`;

    return new Promise((resolve, reject) => {
      Networking.getResponse(url, true)
        .then((response) => {
          const jsonResponse = this.getRawJson(response);

          try {
            // try finding for external servers
            const extServers = jsonResponse.ext_servers;
            const vidstreamingService = extServers.find(
              (s) => s.name === "Vidstreaming"
            );

            StreamService.getPlayableUrl(vidstreamingService.link)
              .then((link) =>
                resolve(this.getJsonObjectWithPlayableLink(jsonResponse, link))
              )
              .catch((_) =>
                StreamService.getBackupPlayableUrl(jsonResponse)
                  .then((link) =>
                    resolve(
                      this.getJsonObjectWithPlayableLink(jsonResponse, link)
                    )
                  )
                  .catch((_) =>
                    resolve(
                      this.getJsonObjectWithPlayableLink(jsonResponse, null)
                    )
                  )
              );
          } catch (_) {
            StreamService.getBackupPlayableUrl(jsonResponse)
              .then((link) =>
                resolve(this.getJsonObjectWithPlayableLink(jsonResponse, link))
              )
              .catch((_) =>
                resolve(this.getJsonObjectWithPlayableLink(jsonResponse, null))
              );
          }
        })
        .catch((err) => reject(err));
    });
  }
}

module.exports = AnimeService;
