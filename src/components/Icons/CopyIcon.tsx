import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const CopyIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('cross-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M20 8V0H6L0 6v18h12v8h20V8H20zM6 2.828V6H2.828L6 2.828zM2 22V8h6V2h10v6l-6 6v8H2zm16-11.172V14h-3.172L18 10.828zM30 30H14V16h6v-6h10v20z" />
    </svg>
  );
};
