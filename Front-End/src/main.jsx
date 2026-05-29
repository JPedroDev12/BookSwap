import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './pInicial.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
