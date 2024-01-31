import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const ShieldIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('shield-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M30 0L16 4 2 0s-.141 1.616 0 4l14 4.378L30 4c.141-2.384 0-4 0-4zM2.256 6.097C3.006 13.931 5.803 27.104 16 32c10.197-4.896 12.995-18.069 13.744-25.903L16 11.264 2.256 6.097z" />
    </svg>
  );
};
