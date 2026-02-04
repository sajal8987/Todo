import { Route, Routes, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Todos from './pages/Todos'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function Layout({ children }) {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-semibold">Todo App</Link>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button onClick={logout} className="text-sm text-red-600 hover:underline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm">Login</Link>
                <Link to="/register" className="text-sm">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t text-center py-3 text-xs text-gray-500">Built with React + Tailwind</footer>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Todos /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}
