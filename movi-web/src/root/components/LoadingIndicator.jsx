import React from "react";

function LoadingIndicator() {
  const imgStylesheet = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <img
      style={imgStylesheet}
      src={require("../../assets/loading.gif")}
      alt="loading-indicator"
    />
  );
}

export default LoadingIndicator;
