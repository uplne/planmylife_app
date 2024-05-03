import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

import { HeaderButton } from "./HeaderButton";
import { MenuButton } from "../../components/Buttons/MenuButton";
import { logOut } from "../Login/login.controller";

import "./Header.css";

export const Header = () => {
  const navigate = useNavigate();

  const onClick = async () => {
    await logOut(navigate);
  };

  return (
    <div className="app-header">
      <div className="app-header__wrapper">
        <div className="app-header__menu">
          <HeaderButton label="My Week" to="/myweek" />
          <HeaderButton label="My Goals" to={`/mygoals`} />
        </div>
        <div className="app-header__menu">
          <HeaderButton label="Settings" to="/settings" />
          <a onClick={onClick}>
            <MenuButton label="Log Out" />
          </a>
        </div>
      </div>
    </div>
  );
};
