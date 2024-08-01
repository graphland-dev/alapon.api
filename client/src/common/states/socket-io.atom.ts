// atoms/socketAtom.js
import { atom } from 'jotai';
import socket from '../clients/socket.io';

export const socketAtom = atom(socket);

socketAtom.debugLabel = 'socketClientAtom';
