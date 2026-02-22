from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from database import get_db
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="API Wisata Tegal Native")

# 1. Pastikan Middleware CORS diletakkan SEBELUM route agar tidak kena blokir
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    query = text("SELECT id, username, role FROM users WHERE username = :u AND password = :p")
    user = db.execute(query, {"u": request.username, "p": request.password}).mappings().first()

    if not user:
        # Typo fix: "success" bukan "succes"
        return {"success": False, "message": "Username atau Password salah"}
    
    return {"success": True, "user": user}

@app.get("/api/wisata")
def get_wisata(db: Session = Depends(get_db)):
    query = text("SELECT id, nama, kategori, deskripsi, foto_url, ST_X(geom) as lng, ST_Y(geom) as lat FROM objek_wisata")
    return db.execute(query).mappings().all()

@app.delete("/api/wisata/{id}")
def delete_wisata(id: int, db: Session = Depends(get_db)):
    query = text("DELETE FROM objek_wisata where id = :id")
    db.execute(query, {"id": id})
    db.commit()
    return {"message": "Data berhasil dihapus"}

# --- PERBAIKAN EDIT (Tambahkan Lat & Lng) ---
class UpdateWisataRequest(BaseModel):
    nama: str
    kategori: str
    deskripsi: str
    lat: float
    lng: float

@app.put("/api/wisata/{id}")
def update_wisata(id: int, request: UpdateWisataRequest, db: Session = Depends(get_db)):
    # Kita harus update geom juga supaya titik di peta berubah saat diedit
    query = text(""" 
        UPDATE objek_wisata
        SET nama = :n, 
            kategori = :k, 
            deskripsi = :d,
            geom = ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
        WHERE id = :id 
    """)
    db.execute(query, {
        "n": request.nama, 
        "k": request.kategori, 
        "d": request.deskripsi, 
        "lat": request.lat, 
        "lng": request.lng, 
        "id": id 
    })
    db.commit()
    return {"message": "Data berhasil diperbarui"}

# --- PERBAIKAN TAMBAH (Parameter :id tertukar :d) ---
class TambahWisataRequest(BaseModel):
    nama: str
    kategori: str
    deskripsi: str
    lat: float
    lng: float

@app.post("/api/wisata")
def tambah_wisata(request: TambahWisataRequest, db: Session = Depends(get_db)):
    # ERROR FIX: Tadi kamu pakai :id untuk deskripsi, harusnya :d
    query = text(""" 
        INSERT INTO objek_wisata (nama, kategori, deskripsi, geom)
        VALUES (:n, :k, :d, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)) 
    """)
    try:
        db.execute(query, {
            "n": request.nama, 
            "k": request.kategori, 
            "d": request.deskripsi, 
            "lng": request.lng, 
            "lat": request.lat
        })
        db.commit()
        return {"message": "Objek wisata berhasil ditambahkan"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))