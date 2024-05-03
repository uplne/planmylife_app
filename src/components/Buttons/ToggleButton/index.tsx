import classnames from "classnames";

import { IconButton } from "../IconButton";
import { ArrowIcon } from "../../Icons";

type ComponentPropsTypes = {
  isOpen: boolean;
  onClick: () => void;
};

export const ToggleButton = ({
  isOpen = false,
  onClick,
}: ComponentPropsTypes) => {
  const classesIcon = classnames(
    "rotate-[-90deg] transition-transform ease-linear",
    {
      "rotate-[90deg]": isOpen,
    },
  );

  return (
    <IconButton
      className="bg-main-background p-[5px] rounded"
      onClick={onClick}
      primary
      hasBounce
    >
      <ArrowIcon className={classesIcon} />
    </IconButton>
  );
};
