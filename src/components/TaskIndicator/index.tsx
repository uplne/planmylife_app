import classnames from "classnames";

type ComponentProps = {
  children: React.ReactNode;
  className?: string;
};

export const TaskIndicator = ({ children, className }: ComponentProps) => {
  const classes = classnames("text-xss px-xs rounded-sm ml-5", className);

  return <div className={classes}>{children}</div>;
};
