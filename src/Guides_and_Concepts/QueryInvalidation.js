import { useState } from 'react';
import { useQueryClient } from 'react-query';

const QueryInvalidation = () => {
  const [todoValue, setTodoValue] = useState();

  const queryClient = useQueryClient();

  const handleButtonTodo = () => {
    const todo = queryClient.getQueryData('todo');
    const { title } = todo;
    setTodoValue(title);
  };

  const handleInvalidate = async () => {
    // will invalidate every queries and refetch everything
    queryClient.invalidateQueries();
    // will invalidate the query that matches the name that uses userQuery hook
    queryClient.invalidateQueries('todo');
    // you can invalidate queries with specific variables too passed down in the query key
    queryClient.invalidateQueries(['todo', { type: 'done' }]);
    // you can pass a predicate function to the invalidateQueries method
    // This function will receive each Query instance from the query cache and allow you to return true or false for whether you want to invalidate that query:
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === 'todo' && query.queryKey[1]?.version >= 10,
    });

    const { title } = queryClient.getQueryData('todo');
    setTodoValue(title);
    console.log('invalidated');
  };

  return (
    <div>
      <div>{todoValue}</div>
      <button onClick={handleButtonTodo}>TODO</button>
      <button onClick={handleInvalidate}>INVALIDATE</button>
    </div>
  );
};

export default QueryInvalidation;
