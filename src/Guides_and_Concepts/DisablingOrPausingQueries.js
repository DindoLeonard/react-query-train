import { useQuery } from 'react-query';
import { fetchTodoList } from './imaginary-api-function';

const DisablingOrPausingQueries = () => {
  function Todos() {
    const { isIdle, isLoading, isError, data, error, refetch, isFetching } =
      useQuery('todos', fetchTodoList, {
        enabled: false,
      });

    return (
      <>
        <button onClick={() => refetch()}>Fetch Todos</button>

        {isIdle ? (
          'Not ready...'
        ) : isLoading ? (
          <span>Loading...</span>
        ) : isError ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <ul>
              {data.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
              ))}
            </ul>
            <div>{isFetching ? 'Fetching...' : null}</div>
          </>
        )}
      </>
    );
  }
};

export default DisablingOrPausingQueries;
