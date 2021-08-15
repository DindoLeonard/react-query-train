import { useQueryClient, useMutation } from 'react-query';

const UpdatesFromMutationResponses = () => {
  const queryClient = useQueryClient();

  const editTodo = () => {
    return { title: 'edit-todo' };
  };

  const mutation = useMutation(editTodo, {
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(['todo', { id: 5 }], data);
      queryClient.getQueryData(['todo', { id: 5 }]);
    },
  });

  const handleMutate = () => {
    mutation.mutate({
      id: 5,
      name: 'Do the laundry',
    });

    const afterMutated = queryClient.getQueryData(['todo', { id: 5 }]);
    console.log('after-mutated', afterMutated);
  };

  const handleQuery = () => {
    const queryData = queryClient.getQueryData(['todo', { id: 5 }]);
    console.log(queryData);
  };

  return (
    <div>
      <button onClick={handleMutate}>MUTATE</button>
      <button onClick={handleQuery}>CHECK QUERY</button>
    </div>
  );
};

export default UpdatesFromMutationResponses;
