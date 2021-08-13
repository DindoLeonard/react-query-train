## React Query

## 3 core concepts of React Query

### reference in src/store/quick-start

- Queries
- Mutations
- Query Invalidation

## Queries

### Query Basics

#### useQuery

[useQuery](https://react-query.tanstack.com/guides/queries).

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

Query keys can be as simple as a string, or as complex as an array of many strings and nested objects. As long as the query key is serializable, and **unique to the query's data**, you can use it!

#### String-Only Query Keys

When a string query key is passed, it is _converted to an array internally with the string as the only item_ in the query key.

```javascript
// A list of todos
 useQuery('todos', ...) // queryKey === ['todos']

 // Something else, whatever!
 useQuery('somethingSpecial', ...) // queryKey === ['somethingSpecial']
```

#### Array Keys

## You can use an array with a string and any number of serializable objects to describe it uniquely. Useful for:

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
