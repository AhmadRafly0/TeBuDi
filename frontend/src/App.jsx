import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Navigate to="/login" replace />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="*" element={
        <div style={{ textAlign: 'center', padding: '4rem', color: '#000000' }}>
          <h1 style={{ fontSize: '4rem' }}>404</h1>
          <p>Halaman tidak ditemukan.</p>
          <a href="/login" style={{ color: '#7c6aff' }}>Kembali ke Login</a>
        </div>
      } />
    </Routes>
  )
}
