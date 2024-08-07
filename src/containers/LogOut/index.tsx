import { useEffect } from "react";
import { Link } from "react-router-dom";
import sample from "lodash/sample";
import { useQueryClient } from "@tanstack/react-query";

import { CenteredBox } from "../../components/CenteredBox";
import { Box } from "../../components/Box";
import { logoutQuotes } from "../../services/logoutQuotes";
import { resetAllStores } from "../../services/createClearable";

import "./Logout.css";

export const LogOut = () => {
  const queryClient = useQueryClient();
  const quote = sample(logoutQuotes) || logoutQuotes[0];

  useEffect(() => {
    async function reset() {
      await resetAllStores();
      await queryClient.resetQueries();
    }

    reset();
  }, []);

  return (
    <CenteredBox>
      <Box className="logout__box">
        <div className="logout__quote">
          <p className="logout__title">{quote.title}</p>
          <p className="logout__author">- {quote.author}</p>
        </div>
        <Link to="/login">Log back in</Link>
      </Box>
    </CenteredBox>
  );
};
