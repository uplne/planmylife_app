import React from 'react';
import classnames from 'classnames';

import { Preloader } from '../../Preloader';

import './BasicButton.css';

type ButtonTypes = {
  onClick?: () => void,
  className?: string,
  children: React.ReactNode,
  secondary?: boolean,
  ternary?: boolean,
  disabled?: boolean,
  small?: boolean,
  withIcon?: boolean,
  loading?: boolean,
  isActive?: boolean,
}

export const BasicButton = ({
  onClick = () => {},
  className = '',
  children,
  secondary = false,
  ternary = false,
  disabled = false,
  small = false,
  withIcon = false,
  loading = false,
  isActive = false,
  ...otherProps
}: ButtonTypes) => {
  const classes = classnames('button', className, {
    'button--secondary': secondary,
    'button--ternary': ternary,
    'button--small': small,
    'button--icon': withIcon,
    'button--isDisabled': disabled,
    'button--isActive isActive': isActive,
  });

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {loading && <Preloader className="button__loader" />}
      {children}
    </button>
  );
};
