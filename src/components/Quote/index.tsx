import classnames from "classnames";

import { quote } from "../../store/Quote/api";

type ComponentTypes = {
  quote: quote["schemas"]["content"];
  author: quote["schemas"]["author"];
  className?: string;
};

export const Quote = ({ quote, author, className = "" }: ComponentTypes) => {
  const classes = classnames("mb-20", className);

  return (
    <div className={classes}>
      <p className="text-2xl text-center mb-5 color-header-text italic font-quote font-bold">
        „{quote}”
      </p>
      <p className="text-sm ml-150 color-header-text font-quote">- {author}</p>
    </div>
  );
};
