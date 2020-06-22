import React from "react";
import LandingScreen from "./screens/LandingScreen";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import QueryResultScreen from "./screens/searchResultScreen";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={LandingScreen} />
        <Route path="/query=:query" component={QueryResultScreen} />
      </Switch>
    </Router>
  );
}

export default App;
