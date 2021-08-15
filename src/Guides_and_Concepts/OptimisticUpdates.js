import { useQueryClient, useMutation } from 'react-query';

const OptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const updateTodo = () => {
    return { test: 'test-todo' };
  };

  const mutation = useMutation(updateTodo, {
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries('todo');

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData('todo');

      // Optimistically update to the new value
      queryClient.setQueryData('todo', (old) => [...old, newTodo]);

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      queryClient.setQueryData('todo', context.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: (newTodo, error, variables, context) => {
      // You can also use the onSettled function in place of the separate onError and onSuccess handlers if you wish:
      if (error) {
        // do something
      }
      queryClient.invalidateQueries('todo');
    },
  });

  const handleMutate = () => {
    mutation.mutate({
      test: 'test-mutate',
    });
  };

  return (
    <div>
      <button onClick={handleMutate}></button>
    </div>
  );
};

export default OptimisticUpdates;
