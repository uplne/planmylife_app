import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const FlagIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('flag-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M0 0h4v32H0V0zM26 20.094c2.582 0 4.83-.625 6-1.547v-16c-1.17.922-3.418 1.547-6 1.547s-4.83-.625-6-1.547v16c1.17.922 3.418 1.547 6 1.547zM19 1.016C17.534.393 15.39 0 13 0 9.988 0 7.365.625 6 1.547v16C7.365 16.625 9.988 16 13 16c2.39 0 4.534.393 6 1.016v-16z" />
    </svg>
  );
};
