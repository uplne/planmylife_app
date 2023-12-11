import classnames from 'classnames';

import './styles.css';

type PropTypes = {
  text: string,
  className?: string | undefined,
  left?: boolean,
};

export const HorizontalText = ({
  text,
  className = undefined,
  left = false,
}: PropTypes) => {
  const classes = classnames('horizontaltext', className, {
    'horizontaltext__left': left,
  });

  return (
    <div className={classes}>
      {text}
    </div>
  );
};
