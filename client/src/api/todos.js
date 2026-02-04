import { api } from './client'

export const listTodos = (status) => api(`/todos${status && status !== 'All' ? `?status=${status}` : ''}`)
export const createTodo = (title, description) => api('/todos', { method: 'POST', body: { title, description } })
export const updateTodo = (id, payload) => api(`/todos/${id}`, { method: 'PUT', body: payload })
export const toggleTodo = (id) => api(`/todos/${id}/toggle`, { method: 'PATCH' })
export const deleteTodo = (id) => api(`/todos/${id}`, { method: 'DELETE' })
