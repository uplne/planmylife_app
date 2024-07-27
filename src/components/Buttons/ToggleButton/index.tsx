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
      className="flex flex-row box-content align-center h-[16px] bg-main-background m-10 mr-0 rounded"
      onClick={onClick}
      primary
      hasBounce
    >
      <ArrowIcon className={classesIcon} />
    </IconButton>
  );
};
