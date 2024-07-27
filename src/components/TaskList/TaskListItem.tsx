import classnames from "classnames";

export type ComponentItemProps = {
  children: React.ReactNode;
  length: number;
  isSub?: boolean;
};

export const TaskListItem = ({
  length,
  children,
  isSub = false,
}: ComponentItemProps) => {
  let classes = classnames(
    `relative before:absolute before:top-[26px] before:block before:content-[''] before:w-2 before:h-[1px] before:border-t before:border-0 before:border-solid before:border-borderSecondary first-of-type:after:absolute first-of-type:after:top-0 first-of-type:after:left-[-1px] first-of-type:after:block first-of-type:after:content-[''] first-of-type:after:w-[1px] first-of-type:after:h-[26px] last-of-type:after:absolute last-of-type:after:bottom-0 last-of-type:after:left-[-1px] last-of-type:after:block last-of-type:after:content-[''] last-of-type:after:w-[1px] last-of-type:after:h-[calc(100%-26px)]`,
    {
      "first-of-type:after:bg-[white] last-of-type:after:bg-[white]": !isSub,
      "last-of-type:after:bg-[white] last-of-type:after:top-1/2": isSub,
    },
  );

  if (length === 1 && !isSub) {
    classes = `relative before:absolute before:top-[28px] before:block before:content-[''] before:w-2 before:h-[1px] before:border-t before:border-0 before:border-solid before:border-borderSecondary after:absolute after:top-0 after:left-[-1px] after:block after:content-[''] after:w-[1px] after:h-full after:bg-[white]`;
  }

  return <li className={classes}>{children}</li>;
};
