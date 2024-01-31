import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CenteredBox } from '../../components/CenteredBox';
import { Box } from '../../components/Box';
import { IconButton } from '../../components/Buttons/IconButton';
import { GoogleIcon } from '../../components/Icons/GoogleIcon';
import { InitialLoader } from '../../components/InitialLoader';
import { HorizontalText } from '../../components/HorizontalText';
import { LoginWithGoogle, ProcessGoogleRedirect, initializeApp, storeUserData } from './controller';
import { auth, getRedirectResult } from '../../services/firebase';
import { useAuthStore } from '../../store/Auth';
import { useAppStore } from '../../store/App';

import './styles.css';

export const Login = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuthStore();
  const { isLoading, setIsLoading } = useAppStore();
  const navigate = useNavigate();

  const onClickGoogle = async () => {
    await LoginWithGoogle();
  };

  useEffect(() => {
    (async () => {
      await setIsLoading(true);

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          await storeUserData({
            user,
          });
          await setIsLoggedIn(true);
          await setIsLoading(false);
          navigate('/myweek');
        } else {
          await setIsLoggedIn(false);
          await setIsLoading(false);
          navigate('/login');
        }
      });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      await setIsLoading(true);

      const result = await getRedirectResult(auth);

      if (result) {
        await ProcessGoogleRedirect(result);
      } else {
        await setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      initializeApp(navigate);
    }
  }, [isLoggedIn]);

  if (isLoading && !isLoggedIn) {
    return <InitialLoader />;
  }

  return (
    <CenteredBox>
      <Box className="w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-center mb-20">Hi. Where are you headed?</h1>

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
