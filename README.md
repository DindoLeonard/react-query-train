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
