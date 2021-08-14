import {
  focusManager,
  QueryClient,
  QueryClientProvider,
  useQuery,
} from 'react-query';
import { fetchTodos } from './imaginary-api-function';

//** DISABLING GLOBALLY */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const WindowFocusRefetching = (props) => {
  //** DISABLING PER-QUERY */
  useQuery('todos', fetchTodos, { refetchOnWindowFocus: false });

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  );
};

//** CUSTOM WINDOW FOCUS EVENT */
const onWindowFocus = focusManager.setEventListener((handleFocus) => {
  // Listen to visibillitychange and focus
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', handleFocus, false);
    window.addEventListener('focus', handleFocus, false);
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', handleFocus);
    window.removeEventListener('focus', handleFocus);
  };
});

//** IGNORING IFRAME FOCUS EVENTS */
focusManager.setEventListener(onWindowFocus); // Boom!

//** MANAGING FOCUS STATE */
// Override the default focus state
focusManager.setFocused(true);
// Fallback to the default focus check
focusManager.setFocused(undefined);

export default WindowFocusRefetching;
