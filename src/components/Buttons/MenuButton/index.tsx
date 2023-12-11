import classnames from 'classnames';

import { BasicButton } from '../BasicButton';

import './MenuButton.css';

type MenuButtonTypes = {
  className?: string,
  label: string,
};

export const MenuButton = ({
  className = '',
  label,
}: MenuButtonTypes) => {
  const classes = classnames('menubutton', className);

  return (
    <BasicButton className={classes}>
      {label}
    </BasicButton>
  );
};
