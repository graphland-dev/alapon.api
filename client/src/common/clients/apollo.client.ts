import { ApolloClient, InMemoryCache } from '@apollo/client';
import { TokenService } from '../utils/TokenService';

const buildHeader = () => {
  const token = TokenService.getToken();
  const header = {
    authorization: `Bearer ${token}`,
  };
  return header;
};

export const apolloClient = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache({
    addTypename: false,
  }),
  headers: buildHeader(),
});
