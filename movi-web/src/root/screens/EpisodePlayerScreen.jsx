import React, { useEffect, useState } from "react";

import Networking from "../../services/Networking";
import Constants from "../../services/Util";
import LoadingIndicator from "../components/LoadingIndicator";

export default function EpisodePlayerScreen({ match }) {
  const {
    params: { animeID, episodeID },
  } = match;

  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [epnum, setEpnum] = useState("");
  const [animeName, setAnimeName] = useState("");
  const [links, setLinks] = useState([]);

  useEffect(() => {
    Networking.getResponse(
      `${Constants.baseUrl}/api/anime/${animeID}/${episodeID}`
    )
      .then((response) => {
        const jsonResponse = JSON.parse(response);

        const l = [
          jsonResponse.episode.link1,
          jsonResponse.episode.link2,
          jsonResponse.episode.link3,
          jsonResponse.episode.link4,
        ].filter((l) => l !== "");

        setAnimeName(jsonResponse.anime.name);
        setEpnum(jsonResponse.episode.name);
        setVideoUrl(jsonResponse.playableLink);
        setLinks(l);

        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = {
    mainDiv: {
      position: "static",
      color: "black",
      margin: "0 2%",
      textAlign: "center",
      paddingTop: "10px",
    },
    video: {
      marginTop: "20px",
      width: "70%",
    },
    a: {
      display: "block",
      marginTop: "5px",
      marginBottom: "5px",
    },
  };

  return (
    <div style={style.mainDiv}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <h1>{animeName}</h1>
          <h5>
            <strong>{epnum}</strong>
          </h5>

          {videoUrl !== null ? (
            <video style={style.video} controls>
              <source src={videoUrl} />
            </video>
          ) : (
            <div>
              <p>
                Something went wrong, Please try watching from any of the
                following links:
              </p>
              {links.map((l, index) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={style.a}
                  href={l}
                  key={`external-server-links${index}`}
                >
                  Link {index + 1}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
