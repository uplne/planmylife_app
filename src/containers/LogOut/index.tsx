import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import sample from 'lodash/sample';

import { CenteredBox } from '../../components/CenteredBox';
import { Box } from '../../components/Box';
import { logoutQuotes } from '../../services/logoutQuotes';
import { resetAllStores } from '../../store/ResetStore';

import './Logout.css';

export const LogOut = () => {
  const quote = sample(logoutQuotes) || logoutQuotes[0];

  useEffect(() => {
    resetAllStores();
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
