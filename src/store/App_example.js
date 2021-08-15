import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Mutations from '../Guides_and_Concepts/Mutations';
import QueryInvalidation from '../Guides_and_Concepts/QueryInvalidation';

export const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Mutations />
      <QueryInvalidation />
    </QueryClientProvider>
  );
};

export default App;
