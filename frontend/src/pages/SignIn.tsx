import React, { useState } from 'react'
import { AuthAPI, setAuth } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export function SignIn() {
  const [email, setEmail] = useState(localStorage.getItem('admin_email') || 'admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState<string | null>(null)
  const nav = useNavigate()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      const res = await AuthAPI.login(email, password)
      const token = res.access_token
      localStorage.setItem('token', token)
      localStorage.setItem('admin_email', email)
      setAuth(token)
      nav('/upload')
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-pink-50">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow w-[360px] border border-pink-100">
        <h1 className="text-2xl font-semibold text-magenta-600 mb-4">Room Wizard</h1>
        <p className="text-gray-600 mb-6">Sign in to continue</p>
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={email} onChange={e=>setEmail(e.target.value)} />
        <label className="block text-sm mb-1">Password</label>
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}
        <button className="w-full bg-magenta-600 text-white rounded py-2">Sign In</button>
      </form>
    </div>
  )
}
