import { createContext, useContext, useEffect, useState } from 'react'
import { getMe, loginRequest, logoutRequest, registerRequest } from '../api/auth'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Try to fetch current session
    getMe().then((res) => {
      setUser(res?.user || null)
    }).catch(() => {
      setUser(null)
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    setError('')
    const res = await loginRequest(email, password)
    setUser(res.user)
  }

  const register = async (email, password, name) => {
    setError('')
    await registerRequest(email, password, name)
  }

  const logout = async () => {
    await logoutRequest()
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, error, setError, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
