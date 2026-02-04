import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, setError, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    try {
      setLoading(true)
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn w-full" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>
        <p className="mt-3 text-sm text-gray-600">No account? <Link className="text-blue-600" to="/register">Register</Link></p>
      </div>
    </div>
  )
}
