"use client"
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import {useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Komponen bantuan untuk menggerakkan kamera peta
function FlyLocation({ center }: { center: [number, number] | null }) {
    const map = useMap()
    useEffect(() => {
        if (center) {
            map.flyTo(center, 15, { duration: 2 }) // zoom ke level dengan durasi 2 detik
        }
    },  [center, map])
    return null
} 


// Perbaikan icon lealflet yang sering hilang di Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

export default function Map({ dataWisata, onMarkerClick, focusLocation }: { dataWisata: any[], onMarkerClick: (item: any) => void, focusLocation: [number, number] | null }) {
    return (
        <MapContainer
            center={[ -6.9, 109.15 ]} // Tengah-tengah Tegal
            zoom={13}
            style={{ height: "600px", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />

            {/* Panggil fungsi penggerak kamera di sini*/}
            <FlyLocation center={focusLocation}/>

            {dataWisata.map((item) => (
                <Marker 
                    key={item.id} 
                    position={[item.lat, item.lng]} 
                    icon={icon}
                    eventHandlers={{
                        click: () => onMarkerClick(item), // Fungsi klik marker
                    }}
                >
                    <Popup>
                        <div className="text-black font-sans">
                            <strong>{item.nama}</strong>
                        </div>
                    </Popup>                          
                </Marker>
            ))}
        </MapContainer>
    )
}

