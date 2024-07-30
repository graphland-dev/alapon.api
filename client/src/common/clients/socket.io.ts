import { io } from 'socket.io-client';

const socket = io('/socket', {
  autoConnect: false, // Connect manually
  reconnectionAttempts: 5, // Retry attempts before failing
  reconnectionDelay: 5000, // Delay between retries
});

socket.on('connect', () => {
  console.log('Connected to socket server');
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected from socket server:', reason);
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

export default socket;
