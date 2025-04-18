import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { Buffer } from 'buffer';
window.Buffer = Buffer;
import { SocketProvider } from '../src/components/SocketContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
     <SocketProvider>
      <App />
    </SocketProvider>
  </StrictMode>,
)
