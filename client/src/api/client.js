const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  const contentType = res.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await res.json() : null
  if (!res.ok) {
    throw new Error(data?.message || 'Request failed')
  }
  return data
}
