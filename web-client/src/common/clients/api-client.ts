import axios from 'axios';
import { TokenService } from '../utils/TokenService';

export const gqlRequest = async <T>(payload: {
  query: string;
  variables?: { [key: string]: any };
  options?: {
    headers?: { [key: string]: string };
    passAccessToken?: boolean;
  };
}) => {
  const apiResponse = await fetch(`${import.meta.env.VITE_API_HOST}/graphql`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(payload?.options?.passAccessToken && {
        Authorization: `Bearer ${TokenService.getToken()}`,
      }),
      ...(payload?.options?.headers || {}),
    },
    body: JSON.stringify({
      query: payload.query,
      variables: payload.variables,
    }),
  });

  if (!apiResponse.ok) {
    throw new Error('Failed to fetch data');
  }

  const { data, errors } = await apiResponse.json();

  if (errors) {
    throw new Error(errors.map((e: any) => e.message).join(', '));
  }

  return data as T;
};

export const gql = String.raw;

export const identityApi = axios.create({
  baseURL: import.meta.env.VITE_APP_IDENTITY_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
