import { useQuery } from 'react-query';

const QueryKeys = () => {
  //** STRING-ONLY QUERY KEYS */
  // A list of todos
  useQuery('todos', () => {}); // queryKey === ['todos']

  // Something else, whatever!
  useQuery('somethingSpecial', () => {}); // queryKey === ['somethingSpecial']

  //** ARRAY KEYS */
  // An individual todo
  useQuery(['todo', 5], () => {});
  // queryKey === ['todo', 5]

  // And individual todo in a "preview" format
  useQuery(['todo', 5, { preview: true }], () => {});
  // queryKey === ['todo', 5, { preview: true }]

  // A list of todos that are "done"
  useQuery(['todos', { type: 'done' }], () => {});
  // queryKey === ['todos', { type: 'done' }]

  //** QUERY KEYS ARE HASHED DETERMINISTICALLY! */
  // useQuery(['todos', status, page], ()=>{})
  // useQuery(['todos', page, status], ()=>{})
  // useQuery(['todos', undefined, page, status], ...)

  //** If your query function depends on a variable, include it in your query key */
  // function Todos({ todoId }) {
  //   const result = useQuery(['todos', todoId], () => fetchTodoById(todoId))
  // }
};

export default QueryKeys;
