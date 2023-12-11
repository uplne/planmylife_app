import classnames from 'classnames';

import './styles.css';

type PropTypes = {
  placeholder?: string,
  value?: string,
  className?: string | undefined,
  onChange: () => void,
};

export const Input = ({
  placeholder = '',
  value = '',
  className = undefined,
  onChange,
  ...otherProps
}: PropTypes) => {
  const classes = classnames('input', className);

  return (
    <input
      className={classes}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...otherProps}
    />
  );
};
