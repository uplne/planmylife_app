import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const ColorIcon = ({ className }: ComponentPropTypes) => {
  const classes = classnames('color-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M17.484 12q.609 0 1.055-.422t.445-1.078-.445-1.078T17.484 9t-1.055.422-.445 1.078.445 1.078 1.055.422zm-3-3.984q.609 0 1.055-.445t.445-1.055-.445-1.055-1.055-.445-1.055.445-.445 1.055.445 1.055 1.055.445zm-4.968 0q.609 0 1.055-.445t.445-1.055-.445-1.055-1.055-.445-1.055.445-.445 1.055.445 1.055 1.055.445zm-3 3.984q.609 0 1.055-.422t.445-1.078-.445-1.078T6.516 9t-1.055.422-.445 1.078.445 1.078T6.516 12zM12 3q3.703 0 6.352 2.344T21 11.016q0 2.063-1.477 3.516t-3.539 1.453H14.25q-.656 0-1.078.445t-.422 1.055q0 .516.375.984T13.5 19.5q0 .656-.422 1.078T12 21q-3.75 0-6.375-2.625T3 12t2.625-6.375T12 3z" />
    </svg>
  );
};
