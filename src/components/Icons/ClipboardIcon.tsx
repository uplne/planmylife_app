import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const ClipboardIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('clipboard-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M29 4h-9a4 4 0 00-8 0H3a1 1 0 00-1 1v26a1 1 0 001 1h26a1 1 0 001-1V5a1 1 0 00-1-1zM16 2a2 2 0 11.001 3.999A2 2 0 0116 2zm12 28H4V6h4v3a1 1 0 001 1h14a1 1 0 001-1V6h4v24z" />
      <path d="M14 26.828l-6.414-7.414 1.828-1.828L14 21.172l8.586-7.586 1.829 1.828z" />
    </svg>
  );
};
