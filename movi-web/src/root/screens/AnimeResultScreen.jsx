import React, { useEffect, useState } from "react";

import Networking from "../../services/Networking";
import Constants from "../../services/Util";
import LoadingIndicator from "../components/LoadingIndicator";
import EpisodeItem from "../components/EpisodeItem";

const Entities = require("html-entities").AllHtmlEntities;

export default function AnimeResultScreen({ match }) {
  const {
    params: { animeID },
  } = match;

  const [episodeList, setEpisodeList] = useState([]);
  const [descriptionText, setDescriptionText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Networking.getResponse(`${Constants.baseUrl}/api/anime/${animeID}`)
      .then((response) => {
        const { description, episodes } = JSON.parse(response);

        console.log(response);

        setDescriptionText(description);
        setEpisodeList(episodes);

        setIsLoading(false);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styles = {
    mainDiv: {
      fontFamily: "Noto Sans JP",
      color: "black",
      margin: "20px 2%",
    },
  };

  return (
    <div style={styles.mainDiv}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <strong>Description</strong>
          <p>{new Entities().decode(descriptionText)}</p>

          {episodeList.map((e) => (
            <EpisodeItem data={e} />
          ))}
        </div>
      )}
    </div>
  );
}
