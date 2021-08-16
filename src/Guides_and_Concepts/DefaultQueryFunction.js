import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import axios from 'axios';

const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`
  );
  return data;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

const DefaultQueryFunction = () => {
  // Define a default query function that will receive the query key
  // the queryKey is guaranteed to be an Array here

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Post />
      </div>
    </QueryClientProvider>
  );
};

// You can even leave out the queryFn and just go straight into options
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery(`/posts/${postId}`, {
    enabled: !!postId,
  });

  console.log('status', status);
  console.log('data', data);
  console.log('error', error);
  console.log('isFetching', isFetching);

  return <div></div>;
}

export default DefaultQueryFunction;
