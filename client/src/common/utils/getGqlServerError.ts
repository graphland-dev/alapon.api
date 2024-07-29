import { ApolloError } from '@apollo/client';

export const getGqlServerError = (apolloError: ApolloError | null) => {
  // if (!apolloError) {
  //   return "Something went wrong";
  // }

  const error = apolloError?.graphQLErrors?.[0];
  return error?.message;
};
