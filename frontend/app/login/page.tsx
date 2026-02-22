"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [form, setForm] = useState({ username: '', password: ''})
    const [error, setError] = useState('')
    const router = useRouter()
    
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        const data = await res.json()

        if (data.success) {
            // Simpan role di LocalStorage (sementara untul skripsi)
            localStorage.setItem('userRole', data.user.role)
            localStorage.setItem('userName', data.user.username)
            
            // Redirect berdasarkan role
            if (data.user.role === 'admin') {
                router.push('/admin') // ke halaman kelola data
            } else {
                router.push('/') // ke halamam peta utama
            }
        } else {
            setError(data.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Login SIG Wisata</h1>

                {error && <p  className="bg-red-500/20 text-red-400 p-3 rounded-lg mb-44 text-sm">{error}</p>}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-sm block mb-1">Username</label>
                        <input 
                            type="text"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setForm({...form, username: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-slate-400 text-sm block mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full cursor-pointer bg-blue-600 hover:bg-blue text-white font-bold py-3 rounded-lg transition shadow-lg">
                        Masuk ke Sistem
                    </button>
                </form>
                <button onClick={() => router.push('/forgot-password')} className="text-xs text-blue-400 hover:underline">Lupa Password</button>
            </div>
        </div>
    )
}