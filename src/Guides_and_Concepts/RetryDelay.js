import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { fetchTodoList } from './imaginary-api-function';

// Configure for All Queries
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000),
    },
  },
});

const RetryDelay = () => {
  //** OVERRIDE THE retryDelay FUNCTION/INTEGER */
  const result = useQuery('todos', fetchTodoList, {
    retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
  });

  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
};

export default RetryDelay;
