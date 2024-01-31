import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const CheckEmptyIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('checkempty-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M12.42 28.678-.013 16.44l6.168-6.071 6.265 6.167L25.846 3.322l6.168 6.071L12.42 28.678zM3.372 16.441l9.048 8.905L28.628 9.393l-2.782-2.739L12.42 19.868l-6.265-6.167-2.782 2.739z" />
    </svg>
  );
};
