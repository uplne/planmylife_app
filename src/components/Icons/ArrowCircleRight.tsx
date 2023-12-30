import classnames from 'classnames';

type ComponentTypes = {
  className?: string,
};

export const ArrowCircleRight = ({ className }: ComponentTypes) => {
  const classes = classnames('arrow-circle-right-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="28"
      viewBox="0 0 24 28"
    >
      <path d="M20.078 14a.98.98 0 00-.281-.703l-7.078-7.078c-.187-.187-.438-.281-.703-.281s-.516.094-.703.281L9.891 7.641c-.187.187-.281.438-.281.703s.094.516.281.703L12.844 12H5c-.547 0-1 .453-1 1v2c0 .547.453 1 1 1h7.844l-2.953 2.953c-.187.187-.297.438-.297.703s.109.516.297.703l1.422 1.422c.187.187.438.281.703.281s.516-.094.703-.281l7.078-7.078a.981.981 0 00.281-.703zM24 14c0 6.625-5.375 12-12 12S0 20.625 0 14 5.375 2 12 2s12 5.375 12 12z"/>
    </svg>
  );
};
