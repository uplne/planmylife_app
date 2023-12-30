import classnames from 'classnames';

import { quote } from '../../store/Quote/api';

import './Quote.css';

type ComponentTypes = {
  quote: quote['schemas']['content'],
  author: quote['schemas']['author'],
  className?: string,
};

export const Quote = ({ quote, author, className = ''}: ComponentTypes) => {
  const classes = classnames('quote', className);

  return (
    <div className={classes}>
      <p className="quote__quote">„{quote}”</p>
      <p className="quote__author">- {author}</p>
    </div>
  );
};
