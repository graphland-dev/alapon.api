import { useAtom, useAtomValue } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { gql, gqlRequest } from '../clients/api-client';
import { User } from '../api-models/graphql';
import { jotaiStore } from '../configs/jotai.store-config';

const ME_QUERY = gql`
  query ME_QUERY {
    identity__me {
      _id
      handle
      referenceHandle
      accountStatus
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

export interface IAuthStore {
  isAuthenticated: boolean;
  isPending: boolean;
  isFetched: boolean;
  user: User | null;
  logout?: () => Promise<void>;
}
export const authAtom = atomWithImmer<IAuthStore>({
  isAuthenticated: false,
  isPending: false,
  isFetched: false,
  user: null,
});

export async function fetchME() {
  jotaiStore.set(authAtom, (draft) => {
    draft.isPending = true;
  });

  try {
    const data = await gqlRequest<{ identity__me: User } | null>({
      query: ME_QUERY,
      options: { passAccessToken: true },
    });

    jotaiStore.set(authAtom, (draft) => {
      draft.user = data?.identity__me || null;
      draft.isAuthenticated = !!data;
      draft.isFetched = true;
    });

    return data;
  } catch {
    jotaiStore.set(authAtom, (draft) => {
      draft.user = null;
      draft.isAuthenticated = false;
      draft.isFetched = true;
    });
  } finally {
    jotaiStore.set(authAtom, (draft) => {
      draft.isPending = false;
      draft.isFetched = true;
    });
  }
}

export function useAuthState() {
  return useAtomValue(authAtom);
}
