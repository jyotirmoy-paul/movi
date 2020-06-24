import React from "react";
import Card from "@material-ui/core/Card";
import { CardActionArea } from "@material-ui/core";

export default function AnimeItem({ data }) {
  function handleOnClick(slug) {
    console.log(slug);
  }

  return (
    <Card>
      <CardActionArea onClick={() => handleOnClick(data.slug)}>
        <h5>{data.name}</h5>
        <img
          alt="Anime Poster"
          title={data.name}
          src={data.image + data.poster}
          width="100%"
        />
      </CardActionArea>
    </Card>
  );
}
