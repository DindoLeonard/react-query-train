import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

const QueryFunctions = () => {
  const Todos = ({ status, page }) => {
    const { data, isLoading, error } = useQuery(
      ['todos', { status, page }],
      fetchTodoList
    );

    if (isLoading) {
      console.log(isLoading);
    }
    if (error) {
      console.log('ERR', error);
    }

    if (data) {
      console.log(data);
    }
  };

  const fetchTodoList = async ({ queryKey }, something) => {
    // array destructured to a variable
    const [_key, { status, page }] = queryKey;
    console.log('Status', status);
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/${_key}/${page}`
    );
    console.log(something);

    return data;
  };

  Todos({ status: 'ok', page: 100 });

  return <div>Hello</div>;
};

export default QueryFunctions;
