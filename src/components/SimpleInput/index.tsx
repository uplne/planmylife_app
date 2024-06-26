import classnames from "classnames";

import "./SimpleInput.css";

type ComponentPropTypes = {
  id?: string;
  className?: string;
  value?: string | number;
  onChange: (e: any) => void;
  placeholder?: string;
  type?: string;
};

export const SimpleInput = ({
  id = undefined,
  className = undefined,
  value = "",
  onChange,
  placeholder = "",
  type = "text",
}: ComponentPropTypes) => {
  const classes = classnames("simpleinput", className);

  return (
    <input
      id={id}
      className={classes}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
    />
  );
};
