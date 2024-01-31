import classnames from 'classnames';

type ComponentPropTypes = {
  className?: string,
};

export const PushPinIcon = ({ className = undefined }:ComponentPropTypes) => {
  const classes = classnames('pushpin-icon icon', className);

  return (
    <svg
      className={classes}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
    >
      <path d="M17 0l-3 3 3 3-7 8H3l5.5 5.5L0 30.769V32h1.231L12.5 23.5 18 29v-7l8-7 3 3 3-3L17 0zm-3 17l-2-2 7-7 2 2-7 7z" />
    </svg>
  );
};
