
import { io } from 'socket.io-client';

const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  auth: { token: sessionStorage.getItem('token') },
});

socket.on('connect', () =>
  console.log('⚡️ [Socket] connected with id', socket.id, 'auth:', socket.auth)
);
socket.on('connect_error', (err) =>
  console.error('⛔️ [Socket] connection error:', err.message)
);

export default socket;
