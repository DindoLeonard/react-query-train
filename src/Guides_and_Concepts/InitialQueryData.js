import { useQuery } from 'react-query';

const InitialQueryData = () => {
  //** Using initialData to prepopulate a query */
  const initialTodos = 'sample-initial-data';
  useQuery('todos', () => fetch('/todos'), {
    initialData: initialTodos,
  });

  //** staleTime and initialDataUpdatedAt */
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
  useQuery('todos', () => fetch('/todos'), {
    initialData: initialTodos,
    staleTime: 1000,
  });

  // Show initialTodos immeidately, but won't refetch until another interaction event is encountered after 1000 ms
  const initialTodosUpdatedTimestamp = Date.now();
  useQuery('todos', () => fetch('/todos'), {
    initialData: initialTodos,
    staleTime: 60 * 1000, // 1 minute
    // This could be 10 seconds ago or 10 minutes ago
    initialDataUpdatedAt: initialTodosUpdatedTimestamp, // eg. 1608412420052
  });
};

export default InitialQueryData;
