import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Mutations from '../Guides_and_Concepts/Mutations';
import QueryInvalidation from '../Guides_and_Concepts/QueryInvalidation';
import InvalidationFromMutation from '../Guides_and_Concepts/InvalidationFromMutations';
import UpdatesFromMutationResponses from '../Guides_and_Concepts/UpdatesFromMutationResponses';

export const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Mutations />
      <QueryInvalidation />
      <InvalidationFromMutation />
      <UpdatesFromMutationResponses />
    </QueryClientProvider>
  );
};

export default App;
