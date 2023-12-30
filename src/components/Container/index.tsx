import classnames from 'classnames';

import './Container.css';

type ComponentProps = {
  children: React.ReactNode,
  className?: string,
};

export const Container = ({ children, className = '' }: ComponentProps) => {
  const classes = classnames('container', className);

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
