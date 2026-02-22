"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiSearch } from 'react-icons/fi'

export default function AdminDashboard() {
  const [wisata, setWisata] = useState([])
  const [adminName, setAdminName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editData, setEditData] = useState<any>(null) // State untuk Modal Edit
  const [formData, setFormData] = useState({ nama: '', kategori: '', deskripsi: '', lat: 0, lng: 0 })
  const [searchAdmin, setSearchAdmin] = useState('')
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    const name = localStorage.getItem('userName')

    if (role !== 'admin') {
      router.push('/login')
    } else {
      setAdminName(name || 'Admin')
      fetchData()
    }
  }, [router])

  const fetchData = () => {
    fetch('http://localhost:8000/api/wisata')
      .then(res => res.json())
      .then(setWisata)
      .catch(err => console.error("Gagal ambil data:", err))
  }

  // SIMPAN DATA BARU
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('http://localhost:8000/api/wisata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      alert("Berhasil menambah lokasi!")
      setShowAddForm(false)
      setFormData({ nama: '', kategori: '', deskripsi: '', lat: 0, lng: 0 })
      fetchData()
    }
  }

  // UPDATE DATA (PENGGANTI PROMPT)
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`http://localhost:8000/api/wisata/${editData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData)
    })
    if (res.ok) {
      alert("Data berhasil diperbarui!")
      setEditData(null)
      fetchData()
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus data wisata ini?")) {
      const res = await fetch(`http://localhost:8000/api/wisata/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert("Data berhasil dihapus!")
        fetchData()
      }
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  // Filter Data secara real-time berdasrkan nama atau kategori
  const filteredWisata = wisata.filter((item: any) =>
    item.nama.toLowerCase().includes(searchAdmin.toLowerCase()) || 
    item.kategori.toLowerCase().includes(searchAdmin.toLowerCase())
  )


  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">Panel Admin Disporapar Kabupaten Tegal</h1>
            <p className="text-slate-400">Selamat datang, {adminName}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/')} className="bg-slate-700 px-4 py-2 cursor-pointer rounded-lg hover:bg-slate-600 transition border border-slate-600">🌐 Lihat Peta</button>
            <button onClick={handleLogout} className="bg-red-600 cursor-pointer px-4 py-2 rounded-lg hover:bg-red-500 transition">Logout</button>
          </div>
        </div>

        {/* --- MODAL EDIT (MUNCUL DI TENGAH) --- */}
        {editData && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 p-6 rounded-xl border-2 border-yellow-500 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Edit Data: {editData.nama}</h3>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Nama Wisata</label>
                  <input type="text" className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-yellow-500" value={editData.nama} onChange={e => setEditData({...editData, nama: e.target.value})} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Kategori</label>
                  <input type="text" className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-yellow-500" value={editData.kategori} onChange={e => setEditData({...editData, kategori: e.target.value})} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Latitude</label>
                  <input type="number" step="any" className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-yellow-500" value={editData.lat} onChange={e => setEditData({...editData, lat: parseFloat(e.target.value)})} required />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Longitude</label>
                  <input type="number" step="any" className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-yellow-500" value={editData.lng} onChange={e => setEditData({...editData, lng: parseFloat(e.target.value)})} required />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Deskripsi</label>
                  <textarea className="bg-slate-700 p-2 rounded h-24 outline-none focus:ring-1 focus:ring-yellow-500" value={editData.deskripsi} onChange={e => setEditData({...editData, deskripsi: e.target.value})} />
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 cursor-pointer px-6 py-2 rounded-lg font-bold transition">Simpan Perubahan</button>
                  <button type="button" onClick={() => setEditData(null)} className="bg-slate-600 cursor-pointer hover:bg-slate-500 px-6 py-2 rounded-lg transition">Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- FORM TAMBAH DATA --- */}
        {showAddForm && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 p-6 rounded-xl border-2 border-green-500 w-full max-w-2xl shadow-2xl animate-in zoom-in duration-200">
              <h3 className="text-xl font-bold mb-4 text-green-500 flex items-center gap-2">
                   Tambah Lokasi Wisata Baru
              </h3>
      
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-slate-400">Nama Wisata</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Waduk Cacaban"
                    className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-green-500" 
                    onChange={e => setFormData({...formData, nama: e.target.value})} 
                    required 
                  />
                </div>

                <div className="flex flex-col gap-1">
                   <label className="text-xs text-slate-400">Kategori</label>
                   <input 
                      type="text" 
                      placeholder="Contoh: Wisata Alam"
                      className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-green-500" 
                      onChange={e => setFormData({...formData, kategori: e.target.value})} 
                      required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Latitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="-6.9xxx"
                      className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-green-500" 
                      onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} 
                      required 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Longitude</label>
                    <input 
                      type="number" 
                      step="any" 
                      placeholder="109.1xxx"
                      className="bg-slate-700 p-2 rounded outline-none focus:ring-1 focus:ring-green-500" 
                      onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} 
                      required 
                    />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-slate-400">Deskripsi</label>
                    <textarea 
                      placeholder="Jelaskan daya tarik wisata ini..."
                      className="bg-slate-700 p-2 rounded h-24 outline-none focus:ring-1 focus:ring-green-500" 
                      onChange={e => setFormData({...formData, deskripsi: e.target.value})} 
                    />
                </div>

                <div className="flex gap-2 mt-2">
                    <button 
                      type="submit" 
                      className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold transition cursor-pointer"
                    >
                      Simpan Data
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddForm(false)} 
                      className="bg-slate-600 hover:bg-slate-500 text-white px-6 py-2 rounded-lg transition cursor-pointer"
                    >
                      Batal
                    </button>
                </div>
              </form>
            </div>
         </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <p className="text-slate-400 text-sm">Total Objek Wisata</p>
            <p className="text-4xl font-bold">{wisata.length}</p>
          </div>
          
          <div className="md:col-span-3 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
              <h2 className="font-bold text-lg">Daftar Objek Wisata Tegal</h2>

              {/* INPUT PENCARIAN ADMIN */}
              <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-slate-400 w-4 h-4"/>
                  </div>
                  <input 
                    type="text"
                    placeholder="Cari nama atau kategori..."
                    className="bg-slate-700/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full transition-all"
                    value={searchAdmin}
                    onChange={(e) => setSearchAdmin(e.target.value)}
                  />
              </div>

              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-slate-700 cursor-pointer px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-600 transition">🖨️ Cetak PDF</button>
                <button onClick={() => setShowAddForm(true)} className="bg-green-600 cursor-pointer px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-500 transition">+ Tambah Data</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-700/50 text-slate-400 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-4">Nama Objek</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Koordinat</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredWisata.length > 0 ? (
                      filteredWisata.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-700/30 transition">
                          <td className="p-4 font-medium">{item.nama}</td>
                          <td className="p-4 text-sm text-slate-300">{item.kategori}</td>
                          <td className="p-4 text-xs font-mono text-blue-300">{item.lat}, {item.lng}</td>
                          <td className="p-4 flex justify-center gap-2">
                            <button onClick={() => setEditData(item)} className="text-xs bg-yellow-600/20 cursor-pointer text-yellow-500 px-3 py-1 rounded border border-yellow-600/50 hover:bg-yellow-600 transition">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="text-xs bg-red-600/20 cursor-pointer text-red-500 px-3 py-1 rounded border border-red-600/50 hover:bg-red-600 transition">Hapus</button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 italic">
                         Data Tidak ditemukan...
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}