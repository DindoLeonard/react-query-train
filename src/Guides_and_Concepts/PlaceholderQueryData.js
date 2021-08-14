import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { queryClient } from '../store/App_example';

const PlaceHolderQueryData = () => {
  //** Placeholder Data as a Value */
  const initialTodos = 'sample-place-holder';
  useQuery('todos', () => fetch('/todos'), {
    initialData: initialTodos,
  });

  //** Placeholder Data as a Function */
  const generateFakeTodos = () => {
    return 'sample-place-holder';
  };
  const placeholderData = useMemo(() => generateFakeTodos(), []);
  useQuery('todos', () => fetch('/todos'), { placeholderData });

  //** Placeholder Data from Cache */
  const blogPostId = '123';
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
};

export default PlaceHolderQueryData;
