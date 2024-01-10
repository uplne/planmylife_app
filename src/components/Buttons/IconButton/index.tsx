import classnames from 'classnames';

import './styles.css';

type PropTypes = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void,
  className?: string | undefined,
  children: React.ReactNode,
  withCTA?: boolean,
}

export const IconButton = ({
  onClick,
  className = undefined,
  children,
  withCTA = false,
  ...otherProps
}: PropTypes) => {
  const classes = classnames('icon-button', className, {
    'icon-button--withcta': withCTA,
  });

  return (
    <button className={classes} onClick={onClick} {...otherProps}>
      {children}
    </button>
  );
};
