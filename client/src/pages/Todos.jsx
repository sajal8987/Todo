import { useEffect, useMemo, useState } from 'react'
import { createTodo, deleteTodo, listTodos, toggleTodo, updateTodo } from '../api/todos'

export default function Todos() {
  const [todos, setTodos] = useState([])
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const counters = useMemo(() => {
    const pending = todos.filter(t => t.status === 'Pending').length
    const completed = todos.filter(t => t.status === 'Completed').length
    return { Pending: pending, Completed: completed }
  }, [todos])

  const fetchTodos = async (selectedStatus = status) => {
    setLoading(true)
    setError('')
    try {
      const res = await listTodos(selectedStatus)
      setTodos(res.todos)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos('All') }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    setError('')
    if (!title || !description) return setError('Title and description are required')
    try {
      setSubmitting(true)
      const res = await createTodo(title, description)
      setTitle(''); setDescription('')
      // Prepend
      setTodos(prev => [res.todo, ...prev])
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const onToggle = async (id) => {
    try {
      const res = await toggleTodo(id)
      setTodos(prev => prev.map(t => t._id === id ? res.todo : t))
    } catch (e) { setError(e.message) }
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this todo?')) return
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(t => t._id !== id))
    } catch (e) { setError(e.message) }
  }

  const startEdit = (t) => {
    setEditingId(t._id)
    setEditTitle(t.title)
    setEditDescription(t.description)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEdit = async () => {
    if (!editTitle || !editDescription) return setError('Title and description are required')
    try {
      const res = await updateTodo(editingId, { title: editTitle, description: editDescription })
      setTodos(prev => prev.map(t => t._id === editingId ? res.todo : t))
      cancelEdit()
    } catch (e) { setError(e.message) }
  }

  const applyFilter = async (val) => {
    setStatus(val)
    await fetchTodos(val)
  }

  return (
    <div className="container py-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold mb-3">Add Todo</h2>
          {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
          <form onSubmit={onCreate} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input className="input" value={title} onChange={e=>setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea className="input h-24" value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <button className="btn" disabled={submitting}>{submitting ? 'Creating...' : 'Create'}</button>
          </form>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Your Todos</h2>
            <div className="flex items-center gap-2">
              <select value={status} onChange={e=>applyFilter(e.target.value)} className="input w-auto">
                <option>All</option>
                <option>Pending</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-gray-600 mb-2">Pending: {counters.Pending} • Completed: {counters.Completed}</div>
          {loading ? (
            <div>Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-sm text-gray-600">No todos yet. Create one!</div>
          ) : (
            <ul className="space-y-2">
              {todos.map(t => (
                <li key={t._id} className="border rounded p-3 flex items-start justify-between">
                  {editingId === t._id ? (
                    <div className="flex-1 mr-3">
                      <input className="input mb-2" value={editTitle} onChange={e=>setEditTitle(e.target.value)} />
                      <textarea className="input h-20" value={editDescription} onChange={e=>setEditDescription(e.target.value)} />
                    </div>
                  ) : (
                    <div className="flex-1 mr-3">
                      <div className="font-medium flex items-center gap-2">
                        <span className={t.status === 'Completed' ? 'line-through text-gray-500' : ''}>{t.title}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${t.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{t.status}</span>
                      </div>
                      <p className={`text-sm ${t.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-700'}`}>{t.description}</p>
                      <div className="text-xs text-gray-500 mt-1">Created {new Date(t.createdAt).toLocaleString()}</div>
                    </div>
                  )}
                  <div className="flex flex-col items-end gap-2 w-32">
                    {editingId === t._id ? (
                      <>
                        <button className="btn w-full" onClick={saveEdit}>Save</button>
                        <button className="px-3 py-2 rounded border" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn w-full" onClick={() => onToggle(t._id)}>{t.status === 'Pending' ? 'Complete' : 'Undo'}</button>
                        <button className="px-3 py-2 rounded border" onClick={() => startEdit(t)}>Edit</button>
                        <button className="px-3 py-2 rounded border border-red-300 text-red-600" onClick={() => onDelete(t._id)}>Delete</button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
