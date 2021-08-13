import { useQuery, useIsFetching } from 'react-query';

// example for isFetching
function Todos(fetchTodos) {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery('todos', fetchTodos);

  //** THIS BELOW IS THE EXAMPLE */
  // return status === 'loading' ? (
  //   <span>Loading...</span>
  // ) : status === 'error' ? (
  //   <span>Error: {error.message}</span>
  // ) : (
  //   <>
  //     {isFetching ? <div>Refreshing...</div> : null}

  //     <div>
  //       {todos.map((todo) => (
  //         <Todo todo={todo} />
  //       ))}
  //     </div>
  //   </>
  // );
}

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null;
}

const BackgroundFetchingIndicators = () => {
  return (
    <div>
      GlobalLoadingIndicator
      <div>
        <GlobalLoadingIndicator />
      </div>
    </div>
  );
};

export default BackgroundFetchingIndicators;
