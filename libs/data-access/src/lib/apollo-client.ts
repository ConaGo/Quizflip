import { ApolloClient, InMemoryCache } from '@apollo/client';

//ATTENTION process.env is not defined on the client
//everything rendered in the browser will take the uri default
export const client = new ApolloClient({
  uri: process.env.NX_GRAPHQL_URI || 'http://localhost:3070/graphql',
  cache: new InMemoryCache(),
});
