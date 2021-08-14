import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import InfiniteQueries from '../Guides_and_Concepts/InfiniteQueries';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <InfiniteQueries />
    </QueryClientProvider>
  );
};

export default App;
