import classnames from 'classnames';

import './Preloader.css';

type PropsTypes = {
  className?: string | '',
  small?: boolean,
  title?: string | React.ReactNode,
};

export const Preloader = ({ className = '', small = false, title = null}: PropsTypes) => {
  const classes = classnames('preloader__loader', className, {
    'is-small': small,
  });

  return (
    <div className="preloader"  data-testid="preloader">
      {title && <p>{title}</p>}
      <div className={classes}><div></div><div></div><div></div><div></div></div>
    </div>
  );
};
