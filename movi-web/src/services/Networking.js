import http from "http";

class Networking {
  static getResponse(url) {
    return new Promise((resolve, reject) => {
      http
        .get(url, (response) => {
          var body = [];
          response.on("data", (c) => body.push(c));

          response.on("end", () => {
            body = Buffer.concat(body).toString();
            resolve(body);
          });
        })
        .on("error", (err) => reject(err));
    });
  }
}

export default Networking;
