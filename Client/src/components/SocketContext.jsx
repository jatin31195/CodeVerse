import React from 'react';
import socket from './socket';

export const SocketContext = React.createContext(socket);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);
