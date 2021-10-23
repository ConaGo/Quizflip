import {
  ApolloClient,
  from,
  HttpLink,
  InMemoryCache,
  fromPromise,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { DTO } from '@libs/shared-types';
import { fetchAuth, _promiseToObservable } from './fetchAuth';
//ATTENTION process.env is not defined on the client
//everything rendered in the browser will take the uri default
const httpLink = new HttpLink({
  credentials: 'include',
  uri: process.env.NX_GRAPHQL_URI || 'http://localhost:3070/graphql',
});

const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    console.log(count, operation, error);
    return !!error && operation.operationName != 'specialCase';
  },
  delay: (count, operation, error) => {
    console.log(error);
    return count * 1000 * Math.random();
  },
});
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(message === 'Unauthorized');
        console.log(operation.getContext().refreshTries);
        if (
          //operation.getContext().refreshTries !== 1 &&
          message === 'Unauthorized'
        ) {
          console.log('hello');
          //operation.setContext({ refreshTries: 1 });
          return forward(operation);
          return _promiseToObservable(
            fetchAuth('http://localhost:3070/', 'refresh', {} as DTO)
          )
            .filter((value) => {
              console.log(value);
              return true;
            })
            .flatMap(() => {
              console.log('retry');
              return forward(operation);
            });
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
  link: from([retryLink, httpLink]),
});
