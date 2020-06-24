import React from "react";
import Card from "@material-ui/core/Card";
import { CardActionArea } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function EpisodeItem({ data }) {
  const style = {
    card: {
      width: "20%",
      margin: "10px",
    },
    cardActionArea: {
      padding: "10px",
      color: "black",
    },
  };

  return (
    <Card style={style.card} className="episode-item-card">
      <Link to={data.slug}>
        <CardActionArea style={style.cardActionArea}>
          <div>
            <strong>{data.epnum}</strong>
            <div>{data.createddate}</div>
          </div>
        </CardActionArea>
      </Link>
    </Card>
  );
}
