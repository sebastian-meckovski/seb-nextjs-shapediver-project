import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import My3DModelViewer from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <My3DModelViewer />
  </StrictMode>,
)
