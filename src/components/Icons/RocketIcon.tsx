import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const RocketIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('archive-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M22 2L12 12H6l-6 8s6.357-1.77 10.065-.94L0 32l13.184-10.255C15.023 25.953 12 32 12 32l8-6v-6l10-10 2-10-10 2z" />
    </svg>
  );
};
