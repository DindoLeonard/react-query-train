import React from 'react';
import { useQuery } from 'react-query';

import fetchTodoList from './api';

function Todos() {
  const { isLoading, isError, data, error } = useQuery('todos', fetchTodoList);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export default Todos;
