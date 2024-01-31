import classnames from 'classnames';

type PropTypes = {
  children: React.ReactNode,
  className?: string | undefined,
};

export const Box = ({ children, className }: PropTypes) => {
  const classes = classnames('flex flex-col max-w-100% relative px-o py-10s', className);

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
