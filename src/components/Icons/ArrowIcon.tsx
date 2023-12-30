import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
  right?: boolean,
};

export const ArrowIcon = ({ className = '', right = false }: ComponentPropTypes) => {
  const classes = classnames('arrow-icon icon', className);

  if (!right) {
    return (
      <svg
        className={classes}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M15.422 16.594L14.016 18l-6-6 6-6 1.406 1.406L10.828 12z"/>
      </svg>
    );
  }

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M8.578 16.594L13.172 12 8.578 7.406 9.984 6l6 6-6 6z"/>
    </svg>
  );
};
