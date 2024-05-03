import classnames from "classnames";

import "./styles.css";

type PropTypes = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string | undefined;
  children: React.ReactNode;
  withCTA?: boolean;
  primary?: boolean;
  secondary?: boolean;
  hasBounce?: boolean;
};

export const IconButton = ({
  onClick,
  className = undefined,
  children,
  withCTA = false,
  primary = false,
  secondary = false,
  hasBounce = false,
  ...otherProps
}: PropTypes) => {
  const classes = classnames("icon-button m-0", className, {
    "hover:translate-y-[-2px] transition-transform ease-in-out": hasBounce,
    "icon-button--withcta": withCTA,
    "bg-[transparent] m-5": primary,
    "icon--secondary flex items-center justify-center pt-[11px] pb-[10px] px-10 leading-4 outline-none border-0 rounded cursor-pointer transition-all bg-[black] text-white hover:bg-primaryHover":
      secondary,
  });

  return (
    <button className={classes} onClick={onClick} {...otherProps}>
      {children}
    </button>
  );
};
