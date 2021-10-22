import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { DTO } from '@libs/shared-types';
import { forwardRef } from 'react';
import { fetchAuth } from './fetchAuth';
//ATTENTION process.env is not defined on the client
//everything rendered in the browser will take the uri default
const httpLink = new HttpLink({
  credentials: 'include',
  uri: process.env.NX_GRAPHQL_URI || 'http://localhost:3070/graphql',
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        if (
          operation.getContext().refreshTries !== 1 &&
          message === 'Unauthorized'
        ) {
          operation.setContext({ refreshTries: 1 });
          return fromPromise(
            fetchAuth(
              'http://localhost:3070/',
              'refresh',
              {} as DTO
            ).catch((error) => console.log(error))
          ).flatMap(() => forward(operation));
        }

        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

export const client = new ApolloClient({
  //uri: process.env.NX_GRAPHQL_URI || 'http://localhost:3070/graphql',
  cache: new InMemoryCache(),
  //credentials: 'include',
  link: from([errorLink, httpLink]),
});
