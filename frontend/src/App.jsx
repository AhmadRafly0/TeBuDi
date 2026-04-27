import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ManagementBookPage from './pages/BookManagementPage';

export default function App() {
  return (
    <>
    
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        
        style: {
          fontWeight: 'bold',
          fontSize: '1rem',
          padding: '16px 24px',
          minWidth: '275px',
        },

        success: {
          style: {
            border: '2px solid #22c55e',
          },
        },
        error: {
          style: {
            border: '2px solid #ef4444',
          },
        },
        loading: {
          style: {
            border: '2px solid #3b82f6',
          },
        },
      }}
    />
    
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/atminbook" element={<ManagementBookPage/>} />

      <Route path="*" element={
        <div style={{ textAlign: 'center', padding: '4rem', color: '#000000' }}>
          <h1 style={{ fontSize: '4rem' }}>404</h1>
          <p>Halaman tidak ditemukan.</p>
          <a href="/login" style={{ color: '#7c6aff' }}>Kembali ke Login</a>
        </div>
      } />
    </Routes>

    </>
  )
}
