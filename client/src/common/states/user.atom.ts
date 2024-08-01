import { atom } from 'jotai';
import { User } from '../api-models/graphql';

export const userAtom = atom<User | null>(null);
export const loadingUserAtom = atom<boolean>(true);

userAtom.debugLabel = 'userAtom';
loadingUserAtom.debugLabel = 'loadingUserAtom';
