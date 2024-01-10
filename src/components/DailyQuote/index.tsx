import {
  useQuery,
} from '@tanstack/react-query';

import { fetchQuotes } from './controller';
import { Quote } from '../Quote';

import './DailyQuote.css';

export const DailyQuote = () => {
  const { data: quote, error, isLoading } = useQuery({ queryKey: ['quote'], queryFn: fetchQuotes });

  if (!quote) {
    return null;
  }

  return (
    <Quote
      className="dailyquote"
      quote={quote.content}
      author={quote.author}
    />
  );
};
