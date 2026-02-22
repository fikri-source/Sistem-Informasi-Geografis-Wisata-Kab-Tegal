"use client"

import { useState } from  'react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ username: '', newPassword: ''})
    const router = useRouter() 


    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        // Di sini nanti bisa buat endpoint API khusus di FastAPI nantinya
        alert("Password berhasil diperbarui (Simulasi)")
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-2 text-center">Reset Password</h1>
                <p className="text-slate-400 text-sm text-center mb-6">Masukkan username untuk ganti passsword baru</p>

                <form onSubmit={handleReset} className="space-y-4">
                    <input
                        type="text" placeholder="Username Anda"
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setForm({...form, newPassword: e.target.value})}
                        required
                    />
                    <input 
                        type="password" placeholder="Password Baru" 
                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setForm({...form, newPassword: e.target.value})}
                        required
                    />
                    <button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition">
                        Update Password
                    </button>
                    <button type="button" onClick={() => router.push('/login')} className="w-full cursor-pointer text-slate-500 text-sm">Kembali Login</button>
                </form>
            </div>
        </div>
    )
}