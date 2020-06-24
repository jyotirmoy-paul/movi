const { parse } = require("node-html-parser");

const Networking = require("./networking");

class StreamService {
  // utility method for converting haloani url to mp4 playable url
  static getPlayableUrl(serverUrl) {
    return new Promise((resolve, reject) => {
      const url = `https:${decodeURIComponent(serverUrl.split("&data=")[1])}`;

      Networking.getResponse(url)
        .then((response) => {
          const root = parse(response, {
            script: true,
          });

          const scripts = root.querySelectorAll("script");
          const s = scripts.find((s) =>
            s.rawText.includes("playerInstance.setup")
          );

          const mp4url = s.rawText
            .toString()
            .split("sources:[{file: ")[1]
            .split(",label: ")[0]
            .replace("'", "");

          resolve(mp4url);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  static getLinkFromIFrame(iFrameUrl) {
    return new Promise((resolve, reject) => {
      Networking.getResponse(iFrameUrl)
        .then((response) => {
          const root = parse(response, {
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
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }

  static checkForMobile2Link(jsonResponse) {
    const links = [
      jsonResponse.episode.link1,
      jsonResponse.episode.link2,
      jsonResponse.episode.link3,
      jsonResponse.episode.link4,
    ];

    var mobile2Link = links.find((l) => l.includes("/mobile2/"));
    return mobile2Link;
  }

  static getBackupPlayableUrl(jsonResponse) {
    const mobile2Link = this.checkForMobile2Link(jsonResponse);

    return new Promise((resolve, reject) => {
      Networking.getResponse(mobile2Link)
        .then((response) => {
          const root = parse(response);
          const iFrame = root.querySelector("#idl-item");
          const iFrameUrl = iFrame.rawAttributes.src;

          this.getLinkFromIFrame(iFrameUrl)
            .then((url) => resolve(url))
            .catch((err) => reject(err));
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  }
}

module.exports = StreamService;
