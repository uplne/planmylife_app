import {
  Link,
  useMatch,
} from "react-router-dom";
import classnames from 'classnames';

import { MenuButton } from "../../components/Buttons/MenuButton";

type PropTypes = {
  label: string,
  to: string,
};

export const HeaderButton = ({ label, to }: PropTypes) => {
  // let match = useMatch({ path: `/${to.split('/')[1]}`, end: true });
  // const classes = classnames('app-header__button', {
  //   'is-active': match,
  // });

  return (
    <Link
      // style={{ textDecoration: match ? "underline" : "none" }}
      to={to}
    >
      <MenuButton label={label} />
    </Link>
  );
};
