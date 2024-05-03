import classnames from "classnames";

import "./styles.css";

type PropTypes = {
  placeholder?: string;
  value?: string;
  className?: string | undefined;
  autoFocus?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Input = ({
  placeholder = "",
  value = "",
  className = undefined,
  onChange,
  autoFocus = false,
  ...otherProps
}: PropTypes) => {
  const classes = classnames("input", className);

  return (
    <input
      autoFocus={autoFocus}
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...otherProps}
    />
  );
};
