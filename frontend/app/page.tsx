"use client"

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' 
import { FiSearch } from 'react-icons/fi'

// Panggil peta secara dinamis (tanpa SSR)
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => <div className="h-[500px bg-slate-800 animate-pulse flex items-center justify-center">Memuat Peta...</div>
})

export default function Home() {
  const [wisata, setWisata] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [focusCoords, setFocusCoords] = useState<[number, number] | null>(null)
  const [selectedWisata, setSelectedWisata] = useState<any>(null) // state detail
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter() // inisialisasi router di sini 

useEffect(() => {
    // Ambil status login dari localStorage
    const role = localStorage.getItem('userRole')
    // jika role kosong (null/undefined), langsung tendang ke /login
    if (!role) {
      router.replace('/login')
      console.log("User belum login, akses terbatas")
    } else {
      setIsAuthorized(true) // jika ada role, baru izinkan render peta
    }
  }, [router])

  // Filter data berdasarkan input pencarian
  const filteredWisata = wisata.filter((item: any) => 
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSearchSelect = (item: any) => {
    setFocusCoords([item.lat, item.lng])
    setSelectedWisata(item)
    setSearchTerm('') // Reset input setelah pilih
  }

  useEffect(() => {
    // Mengetes apakah Next.js bisa "ngobrol" dengan FastAPI
    fetch('http://localhost:8000/api/wisata')
      .then(res => res.json())
      .then(data => setWisata(data))
      .catch((err) => console.error("Gagal ambil data:", err))
  }, [])

  // jika belum terverifikasi, tampilkan layar kosong atau loading 
  if (!isAuthorized) return <div className="bg-slate-900 min-h-screen"></div>


  return (
    <main className="p-8 bg-slate-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">SIG Wisata</h1>

      {/* --- FITUR PENCARIAN --- */}
        <div className="relative mb-6 max-w-md">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400 w-5 h-5"/>
          <input
            type="text"
            placeholder="Cari nama wisata (misal: Guci)..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pl-10 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         
          {/* Dropdown hasil pencarian */}
          {searchTerm && (
            <div className="absolute z-[1000] w-full bg-slate-800 border border-slate-700 mt-1 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
              {filteredWisata.length > 0 ? filteredWisata.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => handleSearchSelect(item)}
                  className="p-3 hover:bg-blue-600 cursor-pointer border-b border-slate-700 last:border-0"
                >
                  <p className="font-bold text-sm">{item.nama}</p>
                  <p className="text-xs text-slate-400">{item.kategori}</p>
                </div>
              )) : <p className="p-3 text-sm text-slate-500">Tidak ditemukan...</p>}
            </div>
          )}
        </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Peta */}
        <div className="lg:col-span-2 shadow-2xl border border border-slate-700 rounded-lg overflow-hidden">
          {/*Kirim props focusLocation ke Map */}
          <Map 
            dataWisata={wisata} 
            onMarkerClick={setSelectedWisata}
            focusLocation={focusCoords}
          />
        </div>

        {/* Kolom Detail & List */}
        <div className="space-y-6">
          {/* Box Detail (Hanya muncul jika ada yang diklik) */}
          {selectedWisata ? (
            <div className="bg-slate-800 p-4 rounded-xl border-2 border-blue-500 animate-in fade-in zoom-in duration-300">
              <img src={selectedWisata.foto_url} alt={selectedWisata.nama} className="w-full h-32 object-cover rounded-lg mb-3" />
              <h2 className="text-xl font-bold text-blue-300">{selectedWisata.nama}</h2>
              <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded-full">{selectedWisata.kategori}</span>
              <p className="text-sm text-slate-300 mt-3 italic">"{selectedWisata.deskripsi}"</p>
              <button onClick={() => setSelectedWisata(null)} className="mt-4 text-xs text-slate-500 hover:text-white underline">Tutup Detail</button>
            </div>
          ) : (
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-center text-slate-500 italic">
              Klik marker di peta untuk melihat detail
            </div>
          )}
 
        {/* Kolom List Wisata */}
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 h-[500px] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Daftar Objek</h2>
          {wisata.length === 0 ? <p className="mb-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition"></p> : (
            wisata.map((item: any) => (
              <div key={item.id} className="mb-3 p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition">
                <p className="font-medium">{item.nama}</p>
                <p className="text-xs text-slate-400">Lat: {item.lat}, Lng: {item.lng}</p>
              </div>
            ))
          )}
          </div> 
        </div>
      </div>

    </main>
  )
}