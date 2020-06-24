import React, { useEffect, useState } from "react";

import LoadingIndicator from "../components/LoadingIndicator";
import Networking from "../../services/Networking";
import AnimeItem from "../components/AnimeItem";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function QueryResultScreen({ match }) {
  const {
    params: { query },
  } = match;

  useEffect(() => {
    Networking.getResponse(`http://localhost:3000/api/query/${query}`)
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
    <div className="query-result-screen-div">
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <div>
          <h4>
            Showing search results for <strong>{query}</strong>
          </h4>

          <div className={classes.root}>
            <Grid container spacing={3}>
              {animeList.map((item) => (
                <Grid item xs={3}>
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

export default QueryResultScreen;
