import classnames from 'classnames';

import './styles.css';

type PropTypes = {
  children: React.ReactNode,
  className?: string | undefined,
};

export const Box = ({ children, className }: PropTypes) => {
  const classes = classnames('box', className);

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
