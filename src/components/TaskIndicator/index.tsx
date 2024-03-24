import classnames from "classnames";

type ComponentProps = {
  moved?: boolean;
  recurring?: boolean | string;
  isInactive?: boolean;
};

export const TaskIndicator = ({
  moved = false,
  recurring = false,
  isInactive = false,
}: ComponentProps) => {
  const classes = classnames("text-xss px-xs rounded-sm ml-5", {
    "bg-tag text-tagText": moved,
    "bg-tagActive text-tagText": recurring,
    "bg-tagInactive": isInactive,
  });
  let copy = "moved";

  if (recurring) {
    copy = `recurring ${recurring}`;
  }

  return <div className={classes}>{copy}</div>;
};
