# React Query

## 3 core concepts of React Query

### reference in `src/store/quick-start`

- Queries
- Mutations
- Query Invalidation

## Queries

### Query Basics

#### useQuery

[useQuery Docs](https://react-query.tanstack.com/guides/queries).

- To subscribe a query in your components or custom hooks, call the `useQuery` hook with at least:
  - A unique key for the query
  - A function that return a promise that:
    - Resolves the data, or
    - Throw an error

```javascript
import {useQuery} from 'react-query'

function(App) {
  const info = useQuery('unique-key', fetchApi)
}
```

The **unique key** you provide is used internally for refetching, caching, and sharing your queries throughout your application.

## Query Keys

### reference in `src/Guides_and_Concepts/QueryKeys.js`

[Query Keys Docs](https://react-query.tanstack.com/guides/query-keys)

Query keys can be as simple as a string, or as complex as an array of many strings and nested objects. As long as the query key is serializable, and **unique to the query's data**, you can use it!

### String-Only Query Keys

When a string query key is passed, it is _converted to an array internally with the string as the only item_ in the query key.

```javascript
// A list of todos
 useQuery('todos', ...) // queryKey === ['todos']

 // Something else, whatever!
 useQuery('somethingSpecial', ...) // queryKey === ['somethingSpecial']
```

### Array Keys

You can use an **array** with a string and any number of serializable objects to describe it uniquely. Useful for:

- Hierarchical or nested resources
  - It's common to pass an **ID**, **index**, or other **primitive**
- Queries with addition parameters
  - It's common to pass an **object** of additional options

```javascript
 // An individual todo
 useQuery(['todo', 5], ...)
 // queryKey === ['todo', 5]

 // And individual todo in a "preview" format
 useQuery(['todo', 5, { preview: true }], ...)
 // queryKey === ['todo', 5, { preview: true }]

 // A list of todos that are "done"
 useQuery(['todos', { type: 'done' }], ...)
 // queryKey === ['todos', { type: 'done' }]
```

### Query Keys are hashed deterministically!

keys in **objects** inside are considered equal no matter the order, below example are all equal

```javascript
 useQuery(['todos', { status, page }], ...)
 useQuery(['todos', { page, status }], ...)
 useQuery(['todos', { page, status, other: undefined }], ...)
```

however with **array** order matters, below examples are not equal

```javascript
 useQuery(['todos', status, page], ...)
 useQuery(['todos', page, status], ...)
 useQuery(['todos', undefined, page, status], ...)
```

#### If your query function depends on a variable, include it in your query key

Since query keys uniquely describe the data they are fetching, they should include any variables you use in your query function that change. For example:

```javascript
function Todos({ todoId }) {
  const result = useQuery(['todos', todoId], () => fetchTodoById(todoId));
}
```

## Query Functions

reference in `src/Guides_and_Concepts/QueryFunctions.js`

Can litterally be any function that return a promise. The promise that is return should either **resolve the data** or **throw an error**

All of the following below are valid query functions

```javascript
useQuery(['todos'], fetchAllTodos);
useQuery(['todos', todoId], () => fetchTodoById(todoId));
useQuery(['todos', todoId], async () => {
  const data = await fetchTodoById(todoId);
  return data;
});
useQuery(['todos', todoId], ({ queryKey }) => fetchTodoById(queryKey[1]));
```

### Handling and Throwing Errors

Any error that is thrown in the query function will be persisted on the error state of the query.

```javascript
const { error } = useQuery(['todos', todoId], async () => {
  if (somethingGoesWrong) {
    throw new Error('Oh no!');
  }

  return data;
});
```

### Query Function Variables

Query keys are also passed into your function, which makes it possible to extract your query functions if needed.

```javascript
function Todos({ status, page }) {
  const result = useQuery(['todos', { status, page }], fetchTodoList);
}

// Access the key, status and page variables in your query function!
function fetchTodoList({ queryKey }) {
  const [_key, { status, page }] = queryKey;
  return new Promise();
}
```

### Using Query Object instead of parameters

instead of `[queryKey, queryFn, config]` parameters, you can also use an object to express the same configuration:

```javascript
import { useQuery } from 'react-query';

useQuery({
  queryKey: ['todo', 7],
  queryFn: fetchTodo,
  ...config,
});
```

## Parallel Queries

"Parallel" queries are queries that are executed in parallel, or at the same time so as to maximize fetching concurrency.

### Manual Parallel Queries

Just using any number of `useQuery` hooks side-by-side.

```javascript
 function App () {
   // The following queries will execute in parallel
   const usersQuery = useQuery('users', fetchUsers)
   const teamsQuery = useQuery('teams', fetchTeams)
   const projectsQuery = useQuery('projects', fetchProjects)
   ...
 }
```

### Dynamic Parallel Queries with `useQueries`

React Query provides a `useQueries` hook, which you can use to dynamically execute as many queries in parallel as you'd like.

`useQueries` accepts an array of query options objects and returns an array of query results:

```javascript
function App({ users }) {
  const userQueries = useQueries(
    users.map((user) => {
      return {
        queryKey: ['user', user.id],
        queryFn: () => fetchUserById(user.id),
      };
    })
  );
}
```

## Dependent Queries

Dependent (or serial) queries depend on previous ones to finish before they can execute. To achieve this, it's as easy as using the enabled option to tell a query when it is ready to run:

```javascript
// Get the user
const { data: user } = useQuery(['user', email], getUserByEmail);

const userId = user?.id;

// Then get the user's projects
const { isIdle, data: projects } = useQuery(
  ['projects', userId],
  getProjectsByUser,
  {
    // The query will not execute until the userId exists
    enabled: !!userId,
  }
);

// isIdle will be `true` until `enabled` is true and the query begins to fetch.
// It will then go to the `isLoading` stage and hopefully the `isSuccess` stage :)
```

## Background Fetching Indicators

You can extract and use `isFetching` which is one of the returned value from useQuery.

```javascript
function Todos() {
  const {
    status,
    data: todos,
    error,
    isFetching,
  } = useQuery('todos', fetchTodos);

  return status === 'loading' ? (
    <span>Loading...</span>
  ) : status === 'error' ? (
    <span>Error: {error.message}</span>
  ) : (
    <>
      {isFetching ? <div>Refreshing...</div> : null}

      <div>
        {todos.map((todo) => (
          <Todo todo={todo} />
        ))}
      </div>
    </>
  );
}
```

### Displaying Global Background Fetching Loading State

if you would like to show a global loading indicator when any queries are fetching (including in the background), you can use the useIsFetching hook:

```javascript
import { useIsFetching } from 'react-query';

function GlobalLoadingIndicator() {
  const isFetching = useIsFetching();

  return isFetching ? (
    <div>Queries are fetching in the background...</div>
  ) : null;
}
```

## Windows Focus Refetching

If a user leaves your application and returns to stale data, **React Query automatically requests fresh data for you in the background**. You can disable this globally or per-query using the `refetchOnWindowFocus` option

### Disabling Globally

```javascript
//
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

### Disabling Per-Query

```javascript
useQuery('todos', fetchTodos, { refetchOnWindowFocus: false });
```

### Custom Window Focus Event

React Query provides a focusManager.setEventListener function that supplies you the callback that should be fired when the window is focused and allows you to set up your own events. When calling focusManager.setEventListener, the previously set handler is removed (which in most cases will be the default handler) and your new handler is used instead. For example, this is the default handler:

```javascript
focusManager.setEventListener((handleFocus) => {
  // Listen to visibillitychange and focus
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('visibilitychange', handleFocus, false);
    window.addEventListener('focus', handleFocus, false);
  }

  return () => {
    // Be sure to unsubscribe if a new handler is set
    window.removeEventListener('visibilitychange', handleFocus);
    window.removeEventListener('focus', handleFocus);
  };
});
```

### Ignoring Iframe Focus Events

A great use-case for replacing the focus handler is that of **iframe** events. Iframes present problems with detecting window focus by both double-firing events and also firing false-positive events when focusing or using iframes within your app. If you experience this, you should use an event handler that ignores these events as much as possible.

```javascript
import { focusManager } from 'react-query';
import onWindowFocus from './onWindowFocus'; // The gist above

focusManager.setEventListener(onWindowFocus); // Boom!
```

### Managing focus state

```javascript
import { focusManager } from 'react-query';

// Override the default focus state
focusManager.setFocused(true);

// Fallback to the default focus check
focusManager.setFocused(undefined);
```

## Disabling/Pausing Queries

You can use `enabled = false` option in the configuration of your `useQuery`

When `enabled` is `false`:

- If the query has cached data
  - The query will be initialized in the `status === 'success'` or `isSuccess` state.
- If the query does not have cached data
  - The query will start in the `status === idle` or `isIdle` state.
- The query will not automatically fetch on mount
- The query will not automatically refetch in the background when new instances mount or new instances appearing
- The query will ignore query client `invalidateQueries` and `refetchQueries` calls that would normally result in the query refetching.
- `refetch` can be used to manually trigger the query to fetch

```javascript
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
```

## Query Retries

React Query will automatically retry the query's request to default of `3`.

You can configure retries both on global and individual query level.

- Setting `retry = false` will disable retries.
- Setting `retry = 6` will retry 6 times before final error is thrown
- Setting `retry = true` will **infinitely** retry failing requests
- Setting `retry = (failureCount, error) => ...` allows for custom logic based on why the request failed.

```javascript
import { useQuery } from 'react-query';

// Make a specific query retry a certain number of times
const result = useQuery(['todos', 1], fetchTodoListPage, {
  retry: 10, // Will retry failed requests 10 times before displaying an error
});
```

## Retry Delay

By dafault, retries in React Query do not happen immediately after a request fails.

The default `retryDelay` is set to double (starting at `1000` ms) with each attempt, but not exceed 30 seconds:

```javascript
// Configure for all queries
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

function App() {
  return <QueryClientProvider client={queryClient}>...</QueryClientProvider>;
}
```

You can also override the `retryDelay` function/integer in both the Provider and Individual query options. Though it is _not recommeded_.

```javascript
const result = useQuery('todos', fetchTodoList, {
  retryDelay: 1000, // Will always wait 1000ms to retry, regardless of how many retries
});
```

## Paginated/Lagged Queries

Rendering paginated data is a very common UI pattern and in React Query, it "just works" by including the page information in the query key:

```javascript
const result = useQuery(['projects', page], fetchProjects);
```

### Better Paginated Queries with `keepPreviousData`

If we were to use useQuery, it would still technically work fine, but the UI would jump in and out of the success and loading states as different queries are created and destroyed for each page or cursor. By setting keepPreviousData to true we get a few new things:

- **The data from the last successful fetch available while new data is being requested, even though the query key has changed**
- When the new data arrives, the previous data is seamlessly swapped to show the new data.
- `isPreviousData` is made available to know what data the query is currently providing you

```javascript
function Todos() {
  const [page, setPage] = React.useState(0);

  const fetchProjects = (page = 0) =>
    fetch('/api/projects?page=' + page).then((res) => res.json());

  const { isLoading, isError, error, data, isFetching, isPreviousData } =
    useQuery(['projects', page], () => fetchProjects(page), {
      keepPreviousData: true,
    });

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div>
          {data.projects.map((project) => (
            <p key={project.id}>{project.name}</p>
          ))}
        </div>
      )}
      <span>Current Page: {page + 1}</span>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{' '}
      <button
        onClick={() => {
          if (!isPreviousData && data.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{' '}
    </div>
  );
}
```

the `keepPreviousData` option also works flawlessly with the `useInfiniteQuery` hook.

## Infinite Queries

Using `useInfiniteQuery` is common if you wanted to add "load more" onto an existing set of data or "infinite scroll".

[Infinite Queries Documentation](https://react-query.tanstack.com/guides/infinite-queries)

reference in `src/Guides_and_Concepts/InfiniteQueries.js`;

## Placeholder Query Data

Placeholder data allows a query to behave as if it already has data, similar to the initialData option, but **the data is not persisted to the cache**. Good while fetching actual data in background initially.

Ways to suuply placeholder data for a query to the cache before you need it.

- Declaratively:
  - Provide `placeholderData` to a query to prepopulate its cache if empty
- Imperatively:
  - Prefetch or fetch the data using `queryClient` and the `placeholderData` option

### Placeholder Data as a Value

```javascript
function Todos() {
  const result = useQuery('todos', () => fetch('/todos'), {
    placeholderData: placeholderTodos,
  });
}
```

### Placeholder Data as a Function

You can memoize the value or pass a memoized function as the `placeholderData` value:

```javascript
function Todos() {
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  const result = useQuery('todos', () => fetch('/todos'), { placeholderData });
}
```

### Placeholder Data from Cache

In some circumstances, you may be able to provide the placeholder data for a query from the cached result of another.

```javascript
function Todo({ blogPostId }) {
  const result = useQuery(
    ['blogPost', blogPostId],
    () => fetch(`/blogPosts/${blogPostId}`),
    {
      placeholderData: () => {
        // Use the smaller/preview version of the blogPost from the 'blogPosts' query as the placeholder data for this blogPost query
        return queryClient
          .getQueryData('blogPosts')
          ?.find((d) => d.id === blogPostId);
      },
    }
  );
}
```

## Initial Query Data

Ways to supply initial data for a query to the cache before you need it.

- Declaratively:
  - Provide `initialData` to a query to prepopulate its cache if empty
- Imperatively:
  - Prefetch the data using `queryClient.prefetchQuery`
  - Manually place the data into the cache using `queryClient.setQueryData`

### Using `initialData` to prepopulate a query

reference at `/src/Guides_and_Concepts/InitialQueryData.js`

[Initial Query Data Documentation](https://react-query.tanstack.com/guides/initial-query-data)

You can use the config.initialData option to set the initial data for a query and skip the initial loading state

> IMPORTANT: `intitialData` is persisted to the cache, so it is not recommended to provide placeholder, partial or incomplete data to this option and instead use `placeholderData`

```javascript
function Todos() {
  const result = useQuery('todos', () => fetch('/todos'), {
    initialData: initialTodos,
  });
}
```

### `staleTime` and `initialDataUpdatedAt`

If you configure your query observer with initialData and a staleTime of 1000 ms, the data will be considered fresh for that same amount of time, as if it was just fetched from your query function.

```javascript
function Todos() {
  // Show initialTodos immediately, but won't refetch until another interaction event is encountered after 1000 ms
   function Todos() {
   // Show initialTodos immeidately, but won't refetch until another interaction event is encountered after 1000 ms
   const result = useQuery('todos', () => fetch('/todos'), {
     initialData: initialTodos,
     staleTime: 60 * 1000 // 1 minute
     // This could be 10 seconds ago or 10 minutes ago
     initialDataUpdatedAt: initialTodosUpdatedTimestamp // eg. 1608412420052
   })
 }
}
```

> If you would rather treat your data as prefetched data, we recommend that you use the `prefetchQuery` or `fetchQuery` APIs to populate the cache beforehand, thus letting you configure your `staleTime` independently from your initialData

### Initial Data Function

This function will be executed only once when the query is initialized, saving you precious memory and/or CPU:

```javascript
function Todos() {
  const result = useQuery('todos', () => fetch('/todos'), {
    initialData: () => {
      return getExpensiveTodos();
    },
  });
}
```

### Initial Data from Cache with optional `initialDataUpdatedAt`

```javascript
function Todo({ todoId }) {
  const result = useQuery(['todo', todoId], () => fetch(`/todos/${todoId}`), {
    initialData: () =>
      queryClient.getQueryData('todos')?.find((d) => d.id === todoId),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState('todos')?.dataUpdatedAt,
  });
}
```

### Conditional Initial Data from Cache

If the source query you're using to look up the initial data from is old, you may not want to use the cached data at all and just fetch from the server. To make this decision easier, you can use the `queryClient.getQueryState` method instead to get more information about the source query, including a `state.dataUpdatedAt` timestamp you can use to decide if the query is "fresh" enough for your needs:

```javascript
function Todo({ todoId }) {
  const result = useQuery(['todo', todoId], () => fetch(`/todos/${todoId}`), {
    initialData: () => {
      // Get the query state
      const state = queryClient.getQueryState('todos');

      // If the query exists and has data that is no older than 10 seconds...
      if (state && Date.now() - state.dataUpdatedAt <= 10 * 1000) {
        // return the individual todo
        return state.data.find((d) => d.id === todoId);
      }

      // Otherwise, return undefined and let it fetch from a hard loading state!
    },
  });
}
```

## Prefetching

You can use the `prefetchQuery` method to prefetch the results of a query to be placed into the cache:

```javascript
const prefetchTodos = async () => {
  // The results of this query will be cached like a normal query
  await queryClient.prefetchQuery('todos', fetchTodos);
};
```

- If data for this query is already in the cache and **not invalidated**, the data will not be fetched
- If a `staleTime` is passed eg. `prefetchQuery('todos', fn, { staleTime: 5000 })` and the data is older than the specified staleTime, the query will be fetched
- If no instances of `useQuery` appear for a prefetched query, it will be deleted and garbage collected after the time specified in `cacheTime`

### Manually Priming a Query

**If you don't need to prefetch it**. You can just use the **Query Client's** `setQueryData` method to directly add or update a query's cached result by key.

```javascript
queryClient.setQueryData('todos', todos);
```

## Mutations

[Mutations Documentation](https://react-query.tanstack.com/guides/mutations)

**IMPORTATNT** reference in `/src/Guides_and_Concepts/Mutations.js`

Unlike queries, mutations are typically used to create/update/delete data or perform server side-effects. For this purpose, React Query exports a `useMutation` hook.

Here's an example of a mutation that adds a new todo to the server:

```javascript
function App() {
  const mutation = useMutation((newTodo) => axios.post('/todos', newTodo));

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' });
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  );
}
```

> IMPORTANT: The mutate function is an asynchronous function, which means you cannot use it directly in an event callback in **React 16 and earlier**. If you need to access the event in onSubmit you need to wrap mutate in another function. This is due to **React event pooling**.

```javascript
// This will not work in React 16 and earlier
const CreateTodo = () => {
  const mutation = useMutation((event) => {
    event.preventDefault();
    return fetch('/api', new FormData(event.target));
  });

  return <form onSubmit={mutation.mutate}>...</form>;
};

// This will work
const CreateTodo = () => {
  const mutation = useMutation((formData) => {
    return fetch('/api', formData);
  });
  const onSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(new FormData(event.target));
  };

  return <form onSubmit={onSubmit}>...</form>;
};
```

### Resetting Mutation State

It's sometimes the case that you need to clear the `error` or `data` of a mutation request. To do this, you can use the `reset` function to handle this:

```javascript
const CreateTodo = () => {
  const [title, setTitle] = useState('');
  const mutation = useMutation(createTodo);

  const onCreateTodo = (e) => {
    e.preventDefault();
    mutation.mutate({ title });
  };

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
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
```

## Query Invalidation

[Query Invalidation Documentation](https://react-query.tanstack.com/guides/query-invalidation)

the `QueryClient` has an `invalidateQueries` method that lets you intelligently mark queries as stale and potentially refetch them too.

When a query is invalidated with `invalidateQueries`, two things happen:

- It is marked as stale. This stale state overrides any `staleTime` configurations being used in useQuery or related hooks
- If the query is currently being rendered via `useQuery` or related hooks, it will also be refetched in the background

### Query Matching with `invalidateQueries`

In this example, we can use the `todos` prefix to invalidate any queries that start with `todos` in their query key:

```javascript
import { useQuery, useQueryClient } from 'react-query';

// Get QueryClient from the context
const queryClient = useQueryClient();

queryClient.invalidateQueries('todos');

// Both queries below will be invalidated
const todoListQuery = useQuery('todos', fetchTodoList);
const todoListQuery = useQuery(['todos', { page: 1 }], fetchTodoList);
```

You can even invalidate queries with specific variables by passing a more specific query key to the `invalidateQueries` method:

```javascript
queryClient.invalidateQueries(['todos', { type: 'done' }]);

// The query below will be invalidated
const todoListQuery = useQuery(['todos', { type: 'done' }], fetchTodoList);

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery('todos', fetchTodoList);
```

If you find yourself wanting **even more** granularity, you can pass a predicate function to the `invalidateQueries` method. This function will receive each `Query` instance from the query cache and allow you to return `true` or `false` for whether you want to invalidate that query:

```javascript
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'todos' && query.queryKey[1]?.version >= 10,
});

// The query below will be invalidated
const todoListQuery = useQuery(['todos', { version: 20 }], fetchTodoList);

// The query below will be invalidated
const todoListQuery = useQuery(['todos', { version: 10 }], fetchTodoList);

// However, the following query below will NOT be invalidated
const todoListQuery = useQuery(['todos', { version: 5 }], fetchTodoList);
```

## Invalidation from Mutations

Invalidating queries is only half the battle. Knowing **when** to invalidate them is the other half. Usually when a mutation in your app succeeds, it's VERY likely that there are related queries in your application that need to be invalidated and possibly refetched to account for the new changes from your mutation.

```javascript
import { useMutation, useQueryClient } from 'react-query';

const queryClient = useQueryClient();

// When this mutation succeeds, invalidate any queries with the `todos` or `reminders` query key
const mutation = useMutation(addTodo, {
  onSuccess: () => {
    queryClient.invalidateQueries('todos');
    queryClient.invalidateQueries('reminders');
  },
});
```

## Updates from Mutation Responses

When dealing with mutations that **update** objects on the server, it's common for the new object to be automatically returned in the response of the mutation. Instead of refetching any queries for that item and wasting a network call for data we already have, we can take advantage of the object returned by the mutation function and update the existing query with the new data immediately using the **Query Client's** `setQueryData` method:

```javascript
const queryClient = useQueryClient();

const mutation = useMutation(editTodo, {
  onSuccess: (data) => {
    queryClient.setQueryData(['todo', { id: 5 }], data);
  },
});

mutation.mutate({
  id: 5,
  name: 'Do the laundry',
});

// The query below will be updated with the response from the
// successful mutation
const { status, data, error } = useQuery(['todo', { id: 5 }], fetchTodoById);
```

You might want to tie the `onSuccess` logic into a reusable mutation, for that you can create a custom hook like this:

```javascript
const useMutateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation(editTodo, {
    // Notice the second argument is the variables object that the `mutate` function receives
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['todo', { id: variables.id }], data);
    },
  });
};
```

## Optimistic Updates

To do this, `useMutation's` `onMutate` handler option allows you to return a value that will later be passed to both `onError` and `onSettled` handlers as the last argument. In most cases, it is most useful to pass a rollback function.

### Updating a list of todos when adding a new todo

```javascript
const queryClient = useQueryClient();

useMutation(updateTodo, {
  // When mutate is called:
  onMutate: async (newTodo) => {
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    await queryClient.cancelQueries('todos');

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData('todos');

    // Optimistically update to the new value
    queryClient.setQueryData('todos', (old) => [...old, newTodo]);

    // Return a context object with the snapshotted value
    return { previousTodos };
  },
  // If the mutation fails, use the context returned from onMutate to roll back
  onError: (err, newTodo, context) => {
    queryClient.setQueryData('todos', context.previousTodos);
  },
  // Always refetch after error or success:
  onSettled: () => {
    queryClient.invalidateQueries('todos');
  },
});
```

You can also use the `onSettled` function in place of the separate `onError` and `onSuccess` handlers if you wish:

```javascript
useMutation(updateTodo, {
  // ...
  onSettled: (newTodo, error, variables, context) => {
    if (error) {
      // do something
    }
  },
});
```

## Query Cancellation

By default, queries that unmount or become unused before their promises are resolved are simply ignored instead of canceled. Why is this?

- For most applications, ignoring out-of-date queries is sufficient.
- Cancellation APIs may not be available for every query function.
- If cancellation APIs are available, they typically vary in implementation between utilities/libraries (eg. Fetch vs Axios vs XMLHttpRequest).

But don't worry! If your queries are high-bandwidth or potentially very expensive to download, React Query exposes a generic way to **cancel** query requests using a cancellation token or other related API. To integrate with this feature, attach a `cancel` function to the promise returned by your query that implements your request cancellation. When a query becomes out-of-date or inactive, this `promise.cancel` function will be called (if available):

### Using `axios`

```javascript
import axios from 'axios';

const query = useQuery('todos', () => {
  // Create a new CancelToken source for this request
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const promise = axios.get('/todos', {
    // Pass the source token to your request
    cancelToken: source.token,
  });

  // Cancel the request if React Query calls the `promise.cancel` method
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
});
```

### Using `fetch`

```javascript
const query = useQuery('todos', () => {
  // Create a new AbortController instance for this request
  const controller = new AbortController();
  // Get the abortController's signal
  const signal = controller.signal;

  const promise = fetch('/todos', {
    method: 'get',
    // Pass the signal to your request
    signal,
  });

  // Cancel the request if React Query calls the `promise.cancel` method
  promise.cancel = () => controller.abort();

  return promise;
});
```
