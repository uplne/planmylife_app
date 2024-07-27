import classnames from "classnames";

type ComponentProps = {
  children: React.ReactNode;
  className?: string;
};

export const TaskIndicator = ({ children, className }: ComponentProps) => {
  const classes = classnames(
    "text-[9px] text-left font-bold z-10 flex flex-row justify-start items-center px-10 py-[5px] uppercase rounded mr-5",
    className,
  );

  return <div className={classes}>{children}</div>;
};
