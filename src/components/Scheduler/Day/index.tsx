import classnames from "classnames";

import { DAYS } from "../../../store/HabitScheduler";

type ComponentProps = {
  label: string;
  onClick: (value: number) => void;
  isSelected?: boolean;
  disabled?: boolean;
};

export const Day = ({
  label,
  onClick,
  isSelected = false,
  disabled = false,
}: ComponentProps) => {
  const classes = classnames(
    "flex flex-col items-center min-w-[52px] px-10 py-15 text-sm rounded-full capitalize transition-colors hover:bg-primaryHover hover:text-white",
    {
      "bg-primary text-white": isSelected,
      "bg-tag": !isSelected,
      "pointer-events-none": disabled,
    },
  );

  return (
    <span
      onClick={() => onClick(DAYS[label as keyof typeof DAYS])}
      className={classes}
    >
      {label.toLowerCase()}
    </span>
  );
};
