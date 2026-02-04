import { api } from './client'

export const registerRequest = (email, password, name) => api('/auth/register', { method: 'POST', body: { email, password, name } })
export const loginRequest = (email, password) => api('/auth/login', { method: 'POST', body: { email, password } })
export const getMe = () => api('/auth/me')
export const logoutRequest = () => api('/auth/logout', { method: 'POST' })
