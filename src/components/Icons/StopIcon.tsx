import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const StopIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('stop-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 29C8.82 29 3 23.18 3 16S8.82 3 16 3s13 5.82 13 13-5.82 13-13 13zm-6-19h12v12H10z" />
    </svg>
  );
};
