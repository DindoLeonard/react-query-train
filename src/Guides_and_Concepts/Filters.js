import { useQueryClient } from 'react-query';

const Filters = async () => {
  const queryClient = useQueryClient();

  //** QUERY FILTERS */
  // Cancel all queries
  await queryClient.cancelQueries();

  // Remove all inactive queries that begin with `posts` in the key
  queryClient.removeQueries('posts', { inactive: true });

  // Refetch all active queries
  await queryClient.refetchQueries({ active: true });

  // Refetch all active queries that begin with `posts` in the key
  await queryClient.refetchQueries('posts', { active: true });

  //** MUTATION FILTER */
  // Get the number of all fetching mutations
  await queryClient.isMutating();

  // Filter mutations by mutationKey
  await queryClient.isMutating({ mutationKey: 'post' });

  // Filter mutations using a predicate function
  await queryClient.isMutating({
    predicate: (mutation) => mutation.options.variables?.id === 1,
  });

  return <div></div>;
};

export default Filters;
