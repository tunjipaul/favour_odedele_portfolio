import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import App from './App.jsx'

// BrowserRouter enables URL-based navigation throughout the app
// It must wrap everything — same idea as wrapping with a Provider in Zustand
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
