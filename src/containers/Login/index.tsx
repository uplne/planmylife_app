import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CenteredBox } from '../../components/CenteredBox';
import { Box } from '../../components/Box';
import { IconButton } from '../../components/Buttons/IconButton';
import { GoogleIcon } from '../../components/Icons/GoogleIcon';
import { HorizontalText } from '../../components/HorizontalText';
import { LoginWithGoogle, ProcessGoogleRedirect, initializeApp } from './controller';
import { auth, getRedirectResult } from '../../services/firebase';
import { useAuthStore } from '../../store/Auth';

import './styles.css';

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { isLoggedIn } = useAuthStore();
  const navigate = useNavigate();

  const onClickGoogle = async () => {
    await setIsLoading(true);
    await LoginWithGoogle();
  };

  useEffect(() => {
    (async () => {
      const result = await getRedirectResult(auth);

      if (result) {
        await ProcessGoogleRedirect(result);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      initializeApp(navigate);
    }
  }, [isLoggedIn])

  return (
    <CenteredBox>
      <Box className="login">
        <h1 className="login__title">Hi. Where are you headed?</h1>

        <div className="login__wrapper">
          <IconButton
            className="icon-button--login"
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
