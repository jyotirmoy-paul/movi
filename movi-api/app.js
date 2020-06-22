const express = require("express");
const https = require("https");
const { parse } = require("node-html-parser");
const { json } = require("express");

const app = express();

const _baseQueryUrl = "https://www.kickassanime.rs/search?q=";
const _error = "ERROR";

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

  return jsonResponse;
}

app.get("/api/query=:query", async (req, res) => {
  const url = _baseQueryUrl + req.params.query;

  https
    .get(url, (response) => {
      var body = [];

      response.on("data", (chunk) => {
        body.push(chunk);
      });

      response.on("end", () => {
        body = Buffer.concat(body).toString();

        const jsonResponse = getRawJson(body);

        res.send(jsonResponse);
      });
    })
    .on("error", (err) => {
      console.log(err);
      res.send(_error);
    });
});

app.listen(3000, () => console.log("Listening at port 3000"));
