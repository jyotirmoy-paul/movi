const https = require("https");

const CacheService = require("./cacheService");

class Networking {
  static getResponse(url, cache) {
    // by default don't cache a website response
    cache = cache || false;

    const cacheService = new CacheService();

    return new Promise((resolve, reject) => {
      if (cache) {
        cacheService
          .getResponse(url)
          .then((body) => resolve(body))
          .catch((_) => {
            // still not cached
            // make the network request and this time cache the output
            https
              .get(url, (res) => {
                var body = [];

                res.on("data", (c) => body.push(c));

                res.on("end", () => {
                  body = Buffer.concat(body).toString();
                  cacheService
                    .saveResponse(url, body, 84600 /*1 day*/)
                    .then(() => resolve(body))
                    .catch((err) => reject(err));
                });
              })
              .on("error", (err) => reject(err));
          });
      } else {
        // not using cache service, directly make the https request
        https
          .get(url, (res) => {
            var body = [];

            res.on("data", (c) => body.push(c));

            res.on("end", () => {
              body = Buffer.concat(body).toString();

              resolve(body);
            });
          })
          .on("error", (err) => reject(err));
      }
    });
  }
}

module.exports = Networking;
