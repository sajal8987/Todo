import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register, setError, error } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please fill all required fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    if (password !== confirm) return setError('Passwords do not match')
    try {
      setLoading(true)
      await register(email, password, name)
      // After registration, navigate to login
      navigate('/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[70vh]">
      <div className="card w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name (optional)</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm password</label>
            <input className="input" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
          </div>
          <button className="btn w-full" disabled={loading}>{loading ? 'Creating account...' : 'Register'}</button>
        </form>
        <p className="mt-3 text-sm text-gray-600">Already have an account? <Link className="text-blue-600" to="/login">Login</Link></p>
      </div>
    </div>
  )
}
