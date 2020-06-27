import https from "https";

class Networking {
  static getResponse(url) {
    return new Promise((resolve, reject) => {
      https
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
