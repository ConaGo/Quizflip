import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
export function withProviders<P>(WrappedComponent: React.ComponentType<P>) {
  const queryClient = new QueryClient();
  const wrapper = (props: P) => {
    return (
      <QueryClientProvider client={queryClient}>
        <WrappedComponent {...props}></WrappedComponent>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    );
  };
  return wrapper;
}
