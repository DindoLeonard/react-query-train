import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import QueryFunctions from '../Guides_and_Concepts/QueryFunctions';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryFunctions />
    </QueryClientProvider>
  );
};

export default App;
