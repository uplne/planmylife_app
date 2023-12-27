import 'semantic-ui-css/semantic.min.css';
import { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { useAppStore } from '../../store/App';
import { auth } from '../../services/firebase';
import { Router } from '../Router';

// import { NotificationContainer } from '../../components/Notification';
// import { checkAuthState } from '../../containers/Login/reducer';
// import Modal from '../../components/Modal';
// import Router from '../Router';
// import Confirm from '../../components/Confirm';
// import HelpContainer from '../HelpContainer';
// import SideModal from '../../components/SideModal';

import './App.css';

export const App = () => {
  const { isLoading, setIsLoading } = useAppStore();

  useEffect(() => {
    (async () => {
      await setIsLoading(true);

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          await useAppStore.getState().setIsLoading(false);
          console.log(window.location.pathname === '/' ? '/myweek' : window.location.pathname);
          redirect(window.location.pathname === '/' ? '/myweek' : window.location.pathname);
        } else {
          await useAppStore.getState().setIsLoading(false);
          redirect('/login');
        }
      });
    })();
  }, []);

  // if (isLoading === STATE.ISLOADING) {
  //   return <InitialLoader />;
  // }

  const router = createBrowserRouter(Router);

  return (
    <div className="app">
      <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
    </div>
  );
};
