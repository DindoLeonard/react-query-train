import { useQuery } from 'react-query';
import axios from 'axios';

const QueryCancellation = () => {
  // Using AXIOS
  const query = useQuery('todos', () => {
    // Create a new CancelToken source for this request
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const promise = axios.get('https://jsonplaceholder.typicode.com/todos', {
      // Pass the source token to your request
      cancelToken: source.token,
    });

    // Cancel the request if React Query calls the `promise.cancel` method
    promise.cancel = () => {
      source.cancel('Query was cancelled by React Query');
    };

    console.log(query);

    // Using FETCH
    // const query = useQuery('todos', () => {
    //   // Create a new AbortController instance for this request
    //   const controller = new AbortController();
    //   // Get the abortController's signal
    //   const signal = controller.signal;

    //   const promise = fetch('https://jsonplaceholder.typicode.com/todos', {
    //     method: 'get',
    //     // Pass the signal to your request
    //     signal,
    //   });

    //   // Cancel the request if React Query calls the `promise.cancel` method
    //   promise.cancel = () => controller.abort();

    //   return promise;
    // });
    return promise;
  });

  return <div></div>;
};

export default QueryCancellation;
