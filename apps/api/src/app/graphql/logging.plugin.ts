import { Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContext,
} from 'apollo-server-plugin-base';

//import this plugin in the providers array of the module where the resolver lives
@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {
  requestDidStart(): GraphQLRequestListener {
    return {
      didEncounterErrors(requestContext: GraphQLRequestContext) {
        console.error('_____________');
        console.error('graphql request error');
        requestContext.errors.forEach((err) => console.error(err.message));
      },
    };
  }
}
