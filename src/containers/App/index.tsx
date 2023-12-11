import 'semantic-ui-css/semantic.min.css';
import { useEffect } from 'react';

// import { NotificationContainer } from '../../components/Notification';
// import { checkAuthState } from '../../containers/Login/reducer';
// import Modal from '../../components/Modal';
// import Router from '../Router';
// import Confirm from '../../components/Confirm';
// import HelpContainer from '../HelpContainer';
// import SideModal from '../../components/SideModal';

import './App.css';

export const App = () => {
  // const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn, shallowEqual);

  useEffect(() => {
    // if (!isLoggedIn) {
    //   // dispatch(checkAuthState(history));
    // }
  }, []);

  // if (isLoading === STATE.ISLOADING) {
  //   return <InitialLoader />;
  // }

  return (
    <div className="app">
      
      {/* <Router isLoggedIn={isLoggedIn} />
      <NotificationContainer />
      <Modal />
      <Confirm />
      <HelpContainer />
      <SideModal /> */}
    </div>
  );
};
