import React from 'react';
import { Link } from 'react-router-dom'; // 🔥 Wajib pakai Link buat navigasi yang mulus
import loginBg from '../../assets/LoginBackground.webp'; // 🔥 Impor gambar sesuai path yang kamu kasih

export default function LandingPage() {
  return (
    // 1. UTAMA: BUNGKUS SELURUH LAYAR & TERAPKAN BG DARI GAMBAR LOGIN
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 font-sans"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* 2. KONTAINER TOMBOL: Taruh di tengah-tengah */}
      <div className="flex justify-center w-full max-w-sm">
        
        {/* 3. TOMBOL LOGIN PANITIA */}
        {/* Desain seragam: Hijau tua kustom, Teks putih kapital bold, rounded-xl */}
        <Link
          to="/login" // 👈 Arahkan ke rute login panitia kamu
          className="border-2 border-white w-full bg-[#133F25] text-white font-bold uppercase text-lg px-8 py-3.5 rounded-xl shadow-md text-center transition duration-300 ease-in-out hover:opacity-90 hover:scale-[1.02] transform"
        >
          Login Panitia
        </Link>

      </div>
    </div>
  );
}