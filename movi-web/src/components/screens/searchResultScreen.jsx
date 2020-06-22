import React, { useEffect } from "react";

function QueryResultScreen({ match }) {
  const {
    params: { query },
  } = match;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="query-result-screen-div">{query}</div>;
}

export default QueryResultScreen;
