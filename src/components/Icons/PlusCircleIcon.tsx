import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const PlusCircleIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('plus-circle-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="28"
      viewBox="0 0 24 28"
    >
      <path d="M19 15v-2c0-.547-.453-1-1-1h-4V8c0-.547-.453-1-1-1h-2c-.547 0-1 .453-1 1v4H6c-.547 0-1 .453-1 1v2c0 .547.453 1 1 1h4v4c0 .547.453 1 1 1h2c.547 0 1-.453 1-1v-4h4c.547 0 1-.453 1-1zm5-1c0 6.625-5.375 12-12 12S0 20.625 0 14 5.375 2 12 2s12 5.375 12 12z" />
    </svg>
  );
};
