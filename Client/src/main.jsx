import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App.jsx';
import { Buffer } from 'buffer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './components/SocketContext.jsx';

window.Buffer = Buffer;

const GOOGLE_CLIENT_ID = '1047135861103-v89cl7qlfa7ka9jc68f2ufkg2s4665s8.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
