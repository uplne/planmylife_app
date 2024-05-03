import React from "react";
import classnames from "classnames";

import { Preloader } from "../../Preloader";

import "./BasicButton.css";

type ButtonTypes = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  ternary?: boolean;
  disabled?: boolean;
  small?: boolean;
  withIcon?: boolean;
  loading?: boolean;
  isActive?: boolean;
};

export const BasicButton = ({
  onClick = () => {},
  className = "",
  children,
  primary = false,
  secondary = false,
  ternary = false,
  disabled = false,
  small = false,
  withIcon = false,
  loading = false,
  isActive = false,
  ...otherProps
}: ButtonTypes) => {
  let classes = classnames(
    "flex items-center justify-center py-sm px-sm outline-none border-0 rounded cursor-pointer transition-all",
    className,
    {
      "bg-primary text-white hover:bg-primaryHover": primary,
      "bg-secondary text-textSecondary border-borderSecondary border-[1px] border-solid hover:bg-secondaryHover":
        secondary && !isActive,
      "bg-primary text-white border-primary border-[1px] border-solid hover:bg-primaryHover":
        secondary && isActive,
      "bg-[transparent] hover:bg-[transparent] hover:text-primary": ternary,
      "bg-[transparent] pointer-events-none": ternary && disabled,
    },
  );

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      role="button"
      {...otherProps}
    >
      {loading && <Preloader className="button__loader" />}
      {children}
    </button>
  );
};
