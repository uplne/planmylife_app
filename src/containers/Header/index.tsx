import moment from 'moment';

import { HeaderButton } from './HeaderButton';
import LogOutButton from './LogOutButton';

import './Header.css';

export const Header = () => {
  // const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  // const isFirstLogin = useAppSelector(state => state.settings.isFirstLogin);

  // if (!isLoggedIn || isFirstLogin) {
  //   return null;
  // }

  return (
    <div className="app-header">
      <div className="app-header__wrapper">
        <div className="app-header__menu">
          <HeaderButton label="My Week" to="/myweek" />
          <HeaderButton label="My Goals" to={`/mygoals/${moment().format('YYYY')}`} />
        </div>
        <div className="app-header__menu">
          <HeaderButton label="Settings" to="/settings" />
          <LogOutButton />
        </div>
      </div>
    </div>
  );
};
