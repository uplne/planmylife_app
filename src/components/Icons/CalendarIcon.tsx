import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const CalendarIcon = ({ className = undefined }: ComponentPropTypes) => {
  const classes = classnames('calendar-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M10 12h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zM4 24h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zm-6-6h4v4h-4zm6 0h4v4h-4zm6 0h4v4h-4zM4 18h4v4H4zM26 0v2h-4V0H8v2H4V0H0v32h30V0h-4zm2 30H2V8h26v22z"/>
    </svg>
  );
};
