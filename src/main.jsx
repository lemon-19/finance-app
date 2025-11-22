import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* <-- Make sure this wraps App */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
