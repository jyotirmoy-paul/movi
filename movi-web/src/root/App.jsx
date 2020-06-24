import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import LandingScreen from "./screens/LandingScreen";
import QueryResultScreen from "./screens/QueryResultScreen";
import AnimeResultScreen from "./screens/AnimeResultScreen";
import EpisodePlayerScreen from "./screens/EpisodePlayerScreen";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingScreen} />
        <Route path="/query=:query" exact component={QueryResultScreen} />
        <Route path="/anime/:animeID" exact component={AnimeResultScreen} />
        <Route
          path="/anime/:animeID/:episodeID"
          exact
          component={EpisodePlayerScreen}
        />
      </Switch>
    </Router>
  );
}

export default App;
