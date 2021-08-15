import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Mutations from '../Guides_and_Concepts/Mutations';

export const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Mutations />
    </QueryClientProvider>
  );
};

export default App;
