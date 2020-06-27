import React, { useState } from "react";
import SearchIcon from "@material-ui/icons/Search";

import { Link } from "react-router-dom";

function LandingScreen() {
  const [searchText, setSearchText] = useState("");

  var page = `/${searchText}`;

  function onTextChange(event) {
    setSearchText(event.target.value);
  }

  const style = {
    mainContainer: {
      height: "100vh",
      backgroundImage:
        'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),url("../assets/bg.jpg")',
      backgroundSize: "cover",
      color: "white",
    },
    logoText: {
      position: "absolute",
      top: "2%",
      left: "2%",
    },
    inputGroup: {
      margin: "20px 0 15px",
    },
    searchLabel: {
      marginLeft: "10px",
    },
    mainContent: {
      padding: "20px",
      width: "50%",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    titleText: {
      fontWeight: "bold",
      marginBottom: "40px",
    },
    text: {
      textAlign: "center",
      position: "static",
    },
    footer: {
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translate(-50%)",
    },
    a: {
      color: "white",
    },
  };

  return (
    <div style={style.mainContainer}>
      <h2 style={style.logoText}>Movi</h2>

      <div style={style.mainContent}>
        <h1 style={{ ...style.titleText, ...style.text }}>
          Watch Animes Online
        </h1>

        <h3 style={style.text}>
          You can find all the animes of your choice. A guaranteed entertainment
          platform.
        </h3>

        <div
          style={{ ...style.inputGroup, ...style.text }}
          className="input-group input-group-lg"
        >
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
                <span style={style.searchLabel}>Search</span>
              </button>
            </Link>
          </div>
        </div>

        <h5 style={style.text}>
          Ready? Steady? Go! Search something already...
        </h5>
      </div>
      <div style={style.footer}>
        <strong>
          <a
            style={style.a}
            href="https://github.com/jyotirmoy-paul/movi/tree/master/movi-web"
          >
            movi-web
          </a>{" "}
        </strong>
        is maintained by{" "}
        <strong>
          <a style={style.a} href="https://github.com/jyotirmoy-paul">
            jyotirmoy-paul
          </a>
        </strong>
      </div>
    </div>
  );
}

export default LandingScreen;
