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

  useEffect(() => {
    Networking.getResponse(
      `${Constants.baseUrl}/api/anime/${animeID}/${episodeID}`
    )
      .then((response) => {
        const jsonResponse = JSON.parse(response);

        setAnimeName(jsonResponse.anime.name);
        setEpnum(jsonResponse.episode.name);
        setVideoUrl(jsonResponse.playableLink);

        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const style = {
    mainDiv: {
      color: "black",
      margin: "0 2%",
      textAlign: "center",
      paddingTop: "10px",
    },
    video: {
      marginTop: "20px",
      width: "50%",
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

          <video style={style.video} controls>
            <source src={videoUrl} />
          </video>
        </div>
      )}
    </div>
  );
}
