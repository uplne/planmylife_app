import {
  useQuery,
} from '@tanstack/react-query';

import { fetchQuotes } from './controller';
import { Quote } from '../Quote';

export const DailyQuote = () => {
  const { data: quote, error, isLoading } = useQuery({ queryKey: ['quote'], queryFn: fetchQuotes });

  if (!quote) {
    return null;
  }

  return (
    <Quote
      className="basis-2/3 flex flex-col justify-end items-end"
      quote={quote.content}
      author={quote.author}
    />
  );
};
