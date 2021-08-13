
import React from 'react';
import { ReactQueryDevtools } from 'react-query/devtools'
import { QueryClientProvider, QueryClient, } from 'react-query'
 
function App() {
  const queryClient = new QueryClient();


  return (
    <QueryClientProvider client={queryClient}>
      {/* The rest of your application */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App;