import React, { useEffect, useState } from "react";

import LoadingIndicator from "../components/LoadingIndicator";
import Networking from "../../services/Networking";
import AnimeItem from "../components/AnimeItem";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import Constants from "../../services/Util";

const useStyles = makeStyles((_) => ({
  root: {
    flexGrow: 1,
  },
  main: {
    margin: "0 2%",
    color: "black",
  },
  h4: {
    paddingTop: "10px",
    paddingBottom: "30px",
  },
}));

export default function QueryResultScreen({ match }) {
  const {
    params: { query },
  } = match;

  useEffect(() => {
    Networking.getResponse(`${Constants.baseUrl}/api/query/${query}`)
      .then((body) => {
        setAnimeList(JSON.parse(body));
        setIsLoading(false);
      })
      .catch((err) => console.log(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [animeList, setAnimeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const classes = useStyles();

  return (
    <div className={classes.main}>
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <h4 className={classes.h4}>
            Showing search results for <strong>{query}</strong>,{" "}
            {animeList.length} results found.
          </h4>

          <div className={classes.root}>
            <Grid container spacing="3">
              {animeList.map((item) => (
                <Grid item xs="6" sm="4" md="3">
                  <AnimeItem data={item} />
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      )}
    </div>
  );
}
