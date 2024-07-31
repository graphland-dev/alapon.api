// atoms/socketAtom.js
import { atom } from 'jotai';
import socket from '../clients/socket.io';

export const socketAtom = atom(socket);
export const socketConnectedAtom = atom(false);
