const https = require("https");

class Networking {
  static getResponse(url) {
    return new Promise((resolve, reject) => {
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
    });
  }
}

module.exports = Networking;
