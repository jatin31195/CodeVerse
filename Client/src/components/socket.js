
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  withCredentials: true,
});

socket.on('connect', () =>
  console.log('⚡️ [Socket] connected with id', socket.id, )
);
socket.on('connect_error', (err) =>
  console.error('⛔️ [Socket] connection error:', err.message)
);

export default socket;
