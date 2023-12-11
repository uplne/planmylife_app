import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { CenteredBox } from '../../components/CenteredBox';
import { BasicButton } from '../../components/Buttons/BasicButton';
import { Input } from '../../components/Input';
import { Box } from '../../components/Box';
import { IconButton } from '../../components/Buttons/IconButton';
import { GoogleIcon } from '../../components/Icons/GoogleIcon';
import { HorizontalText } from '../../components/HorizontalText';
import { auth } from '../../services/firebase';

import './styles.css';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const onClickGoogle = () => {
    setIsLoading(true);
    dispatch({
      type: 'auth/loginWithGoogle',
      payload: history,
    });
  };

  return (
    <CenteredBox>
      <Box className="login">
        <h1 className="login__title">Hi. Where are you headed?</h1>

        <div className="login__wrapper">
          <IconButton
            className="login__icon-button"
            onClick={onClickGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </IconButton>
        </div>
      </Box>
    </CenteredBox>
  );
};
