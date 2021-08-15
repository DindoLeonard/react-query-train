import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

const InvalidationFromMutation = () => {
  const [todoValue, setTodoValue] = useState('');

  const queryClient = useQueryClient();

  const createTodo = () => {
    return { title: 'hello' };
  };

  const mutation = useMutation(createTodo, {
    onSuccess: (data, variables) => {
      console.log(variables);
      queryClient.invalidateQueries('todos');
      // queryClient.invalidateQueries('reminders');
    },
  });

  const handleSetTodo = () => {
    mutation.mutate(
      { title: 'todo' },
      {
        onSuccess: (data, variables) => {
          queryClient.invalidateQueries('todos');
          setTodoValue(data.title);
        },
      }
    );
  };

  return (
    <div>
      <div>{todoValue}</div>
      <button onClick={handleSetTodo}>MUTATE</button>
    </div>
  );
};

export default InvalidationFromMutation;
