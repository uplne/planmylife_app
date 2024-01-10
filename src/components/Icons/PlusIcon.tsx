import classnames from 'classnames';

type PropTypes = {
  className?: string | undefined,
};

export const PlusIcon = ({ className }: PropTypes) => {
  const classes = classnames('plus-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M31 12H20V1a1 1 0 00-1-1h-6a1 1 0 00-1 1v11H1a1 1 0 00-1 1v6a1 1 0 001 1h11v11a1 1 0 001 1h6a1 1 0 001-1V20h11a1 1 0 001-1v-6a1 1 0 00-1-1z" />
    </svg>
  );
};
