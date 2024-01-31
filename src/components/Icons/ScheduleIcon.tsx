import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const ScheduleIcon = ({ className = undefined}: ComponentPropTypes) => {
  const classes = classnames('schedule-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M20.586 23.414L14 16.828V8h4v7.172l5.414 5.414zM16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 28C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12z" />
    </svg>
  );
};
