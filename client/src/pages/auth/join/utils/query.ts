import { gql } from '@apollo/client';

export const JOIN_MUTATION = gql`
  mutation Identity__join($input: JoinUserInput!) {
    identity__join(input: $input) {
      secret
      handle
    }
  }
`;

export const UNIQUE_HANDLE_QUERY = gql`
  query UniqueHandle($handle: String!) {
    identity__getUniqueHandle(handle: $handle)
  }
`;
