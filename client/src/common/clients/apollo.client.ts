import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { TokenService } from '../utils/TokenService';

const httpLink = new HttpLink({ uri: '/graphql' });
const authMiddleware = new ApolloLink((operation, forward) => {
  const buildHeader = () => {
    const token = TokenService.getToken();
    const header = {
      authorization: `Bearer ${token}`,
    };
    return header;
  };

  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...buildHeader(),
    },
  }));

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: from([authMiddleware, httpLink]),

  cache: new InMemoryCache({
    addTypename: false,
  }),
});
