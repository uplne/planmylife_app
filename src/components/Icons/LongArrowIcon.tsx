import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const LongArrowIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('long-arrow-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M19.414 27.414l10-10a2 2 0 000-2.828l-10-10a2 2 0 10-2.828 2.828L23.172 14H4a2 2 0 100 4h19.172l-6.586 6.586c-.39.39-.586.902-.586 1.414s.195 1.024.586 1.414a2 2 0 002.828 0z" />
    </svg>
  );
};
