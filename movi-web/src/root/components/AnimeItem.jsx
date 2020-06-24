import React from "react";
import Card from "@material-ui/core/Card";
import { CardActionArea } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function AnimeItem({ data }) {
  const style = {
    h5: {
      position: "static",
      padding: "5px",
      fontWeight: "bold",
      textAlign: "center",
      color: "black",
    },
  };

  return (
    <Card>
      <Link to={data.slug}>
        <CardActionArea>
          <h5 style={style.h5}>{data.name}</h5>
          <img
            alt="Anime Poster"
            title={data.name}
            src={data.image + data.poster}
            width="100%"
          />
        </CardActionArea>
      </Link>
    </Card>
  );
}
