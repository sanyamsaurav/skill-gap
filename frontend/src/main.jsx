import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{ padding: '40px', fontFamily: 'sans-serif', color: 'red', textAlign: 'center' }}>
      <h1>🚨 MISSING VERCEL ENVIRONMENT VARIABLES 🚨</h1>
      <p style={{ fontSize: '18px', color: 'black' }}>
        The website is crashing because it cannot find the <b>VITE_CLERK_PUBLISHABLE_KEY</b>.
      </p>
      <p style={{ fontSize: '18px', color: 'black' }}>
        Please follow the steps provided by the AI assistant to add your environment variables in the Vercel Dashboard Settings, and then <b>Redeploy</b> the application.
      </p>
      <p style={{ fontSize: '16px', color: 'gray', marginTop: '40px' }}>
        Note: The <code>npm warn deprecated</code> message in your build logs is completely harmless and is NOT the cause of this error.
      </p>
    </div>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>,
  )
}
