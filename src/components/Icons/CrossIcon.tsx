import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const CrossIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('cross-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M31.708 25.708L22 16l9.708-9.708a1 1 0 000-1.414L27.122.292a1 1 0 00-1.414-.001L16 9.999 6.292.291a.998.998 0 00-1.414.001L.292 4.878a1 1 0 000 1.414L10 16 .292 25.708a.999.999 0 000 1.414l4.586 4.586a1 1 0 001.414 0L16 22l9.708 9.708a1 1 0 001.414 0l4.586-4.586a.999.999 0 000-1.414z"/>
    </svg>
  );
};
