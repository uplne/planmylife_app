import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const DotsIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('dots-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <path d="M10.001 7.8a2.2 2.2 0 100 4.402A2.2 2.2 0 0010 7.8zm-7 0a2.2 2.2 0 100 4.402A2.2 2.2 0 003 7.8zm14 0a2.2 2.2 0 100 4.402A2.2 2.2 0 0017 7.8z" />
    </svg>
  );
};
