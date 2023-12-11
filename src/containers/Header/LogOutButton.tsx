import { Button } from 'semantic-ui-react';
import { useLocation } from 'react-router-dom';

import './Header.css';

const LogOutButton = () => {
  let location = useLocation();

  const onClick = () => {
    // dispatch({
    //   type: 'auth/logOut',
    //   payload: location,
    // });
  };

  return (
    <Button
      className="app-header__button"
      onClick={onClick}
      basic
    >
      Log Out
    </Button>
  );
};

export default LogOutButton;
