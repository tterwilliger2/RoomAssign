import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './index.css'
import { SignIn } from './pages/SignIn'
import { Upload } from './pages/Upload'
import { Setup } from './pages/Setup'
import { Run } from './pages/Run'
import { Blueprint } from './pages/Blueprint'
import { ExportPage } from './pages/ExportPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/run" element={<Run />} />
        <Route path="/blueprint" element={<Blueprint />} />
        <Route path="/export" element={<ExportPage />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
