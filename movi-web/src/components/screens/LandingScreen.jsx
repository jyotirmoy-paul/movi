import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";

import { Link } from "react-router-dom";

function LandingScreen() {
  const [searchText, setSearchText] = useState("");

  var page = "/query=" + searchText;

  function onTextChange(event) {
    setSearchText(event.target.value);
  }

  return (
    <div className="landing-screen-div">
      <h2 className="logo-text">Movi</h2>

      <div className="main-content">
        <h1 className="title-text">Watch Animes Online</h1>

        <h3 className="subtitle-text">
          You can find all the animes of your choice. A guaranteed entertainment
          platform.
        </h3>

        <div className="input-group input-group-lg">
          <input
            onChange={onTextChange}
            type="text"
            value={searchText}
            className="form-control"
            placeholder="Search for an Anime"
          />
          <div className="input-group-append">
            <Link to={page}>
              <button
                className="btn btn-primary btn-lg"
                type="button"
                id="button-addon2"
              >
                <SearchIcon />
                <span className="search-label">Search</span>
              </button>
            </Link>
          </div>
        </div>

        <h5 className="bottom-text">
          Ready? Steady? Go! Search something already...
        </h5>
      </div>
    </div>
  );
}

export default LandingScreen;
