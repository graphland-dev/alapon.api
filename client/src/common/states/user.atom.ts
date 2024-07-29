import { atomWithStorage } from 'jotai/utils';
import { User } from '../api-models/graphql';

export const userAtom = atomWithStorage<User | null>('auth:user', null);

// export const userAtom = atom<User | null>(userStoredAtom);
// export const userPermissionsAtom = atom<RolePermission[] | null>(null);
// export const userTenantsAtom = atom<Tenant[] | null>(null);
