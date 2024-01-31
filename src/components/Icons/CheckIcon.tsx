import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const CheckIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('check-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="34"
      height="34"
      viewBox="0 0 34 34"
    >
      <path d="M27 4L12 19l-7-7-5 5 12 12L32 9z"/>
    </svg>
  );
};
