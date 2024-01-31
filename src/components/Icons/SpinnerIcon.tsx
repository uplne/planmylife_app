import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const SpinnerIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('spinner-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M32 12H20l4.485-4.485C22.218 5.249 19.205 4 16 4S9.781 5.248 7.515 7.515C5.249 9.782 4 12.795 4 16s1.248 6.219 3.515 8.485C9.782 26.751 12.795 28 16 28s6.219-1.248 8.485-3.515c.189-.189.371-.384.546-.583l3.01 2.634A15.96 15.96 0 0 1 16 32C7.163 32 0 24.837 0 16S7.163 0 16 0c4.418 0 8.418 1.791 11.313 4.687L32 0v12z" />
    </svg>
  );
};
