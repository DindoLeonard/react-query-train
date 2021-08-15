import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import axios from 'axios';

// function Mutations() {
//   const mutation = useMutation((newTodo) =>
//     axios.post('https://jsonplaceholder.typicode.com/todos', newTodo)
//   );

//   const onClick = () => {
//     mutation.mutate({ id: new Date(), title: 'Do Laundry' });
//   };

//   return (
//     <div>
//       {mutation.isLoading ? (
//         'Adding todo...'
//       ) : (
//         <>
//           {mutation.isError ? (
//             <div>An error occurred: {mutation.error.message}</div>
//           ) : null}

//           {mutation.isSuccess ? <div>Todo added!</div> : null}

//           <button onClick={onClick}>Create Todo</button>
//         </>
//       )}
//     </div>
//   );
// }

const Mutations = () => {
  const queryClient = useQueryClient();

  const createTodo = (inputData) => {
    return axios.post('https://jsonplaceholder.typicode.com/todos', inputData);
  };

  const [title, setTitle] = useState('');
  const mutation = useMutation(createTodo, {
    onMutate: (variables) => {
      // set query datas
      const todo = queryClient.setQueryData('todo', variables);
      const testQuery = queryClient.setQueryData('testQuery', 'testing');

      const todoData = queryClient.getQueryData('todo') || undefined;
      const testQueryData = queryClient.getQueryData('testQuery');
      const state = queryClient.getQueryCache();
      const dehydrated = dehydrate(queryClient);
      queryClient.resetQueries();
      const afterState = queryClient.getQueryData('testQuery');

      console.log('TODO', todo);
      console.log('TEST-QUERY', testQuery);
      console.log('TODO-RESULT', todoData);
      console.log('TEST-QUERY-DATA', testQueryData);
      console.log('current-state', state);
      console.log('AFTER-DEHYDRATE', dehydrated);
      console.log('after-dehydrate-state', afterState);

      // A mutation is about to happen!

      // Optionally return a context containing data to use when for example rolling back
      console.log('on-mutate-variables', variables);
      return { id: 1, keys: Object.keys(variables) };
    },
    onSuccess: async (data, variables, context) => {
      console.log("I'm first!");
      console.log('on-success-data', data);
      console.log('on-success-variables', variables);
      console.log('on-success-context', context);
    },
    onError: (error, variables, context) => {
      // An error happened!
      console.log(`rolling back optimistic update with id ${context.id}`);
    },
    onSettled: async (data, error, variables, context) => {
      // Error or success... doesn't matter!
      console.log("I'm second!");
    },

    //** RETRY number of times if error */
    retry: 3,
  });

  const onCreateTodo = async (e) => {
    e.preventDefault();
    if (mutation.data) {
      console.log('data', mutation.data);
    }

    //** Synchronous mutation */
    // mutation.mutate(
    //   { title },
    //   {
    //     onSuccess: (data, variables) => {
    //       console.log('additional-callback', variables);
    //     },
    //   }
    // );

    //** Asynchronous mutation */
    try {
      const todo = await mutation.mutateAsync(
        { title },
        {
          onSuccess: (data, variables, context) => {
            console.log('additional-callback', variables);
          },
        }
      );
      console.log('MUTATE_ASYNC', todo);
    } catch (error) {
      // console.log(error);
    }
  };

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <div>
          <h5 onClick={() => mutation.reset()}>Error-click-to-reset</h5>
        </div>
      )}
      {mutation.isLoading && <div>Loading...</div>}
      {mutation.isSuccess && <div>{mutation.data.data.title}</div>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  );
};

export default Mutations;
