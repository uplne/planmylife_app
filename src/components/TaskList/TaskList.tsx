import classnames from "classnames";

type ComponentProps = {
  children: React.ReactNode;
  className?: string;
  isSub?: boolean;
};

export const TaskList = ({
  children,
  className,
  isSub = false,
}: ComponentProps) => {
  const classes = classnames(
    "list-none mx-0 px-0 border-l border-0 border-solid border-borderSecondary",
    className,
    {
      "ml-20": isSub,
    },
  );

  return <ul className={classes}>{children}</ul>;
};
