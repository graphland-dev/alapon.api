import { atomWithStorage } from 'jotai/utils';
import { User } from '../api-models/graphql';
import { atom } from 'jotai';

export const userAtom = atomWithStorage<User | null>('auth:user', null);
export const loadingUserAtom = atom<boolean>(true);

userAtom.debugLabel = 'userAtom';
loadingUserAtom.debugLabel = 'loadingUserAtom';
