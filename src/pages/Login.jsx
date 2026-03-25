import { useState } from 'react';
import { Link } from 'react-router-dom';
// Ikon dari react-icons (Heroicons set)
import { FiBookOpen, FiEye, FiEyeOff } from 'react-icons/fi';
import loginBg from "../assets/LoginBackground.webp"
import baktiLogoText from "../assets/BaktiLogoText.webp"

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // KODE WARNA SPESIFIK UNAND (Bisa dipindah ke index.css @theme nantinya)
  const unandColors = {
    darkGreen: '#004D25', // Hijau tua Unand (Background utama)
    brightGreen: '#67E53D', // Hijau terang (Aksen teks)
    leafDark: '#014421', // Hijau daun gelap (Placeholder bg jika tanpa gambar)
  };

  return (
    // MAIN CONTAINER: Menggunakan Grid untuk split screen di desktop, stack di mobile.
    // GANTI baris 'bg-[...]' dengan URL gambar dedaunan asli jika sudah ada.
    <div
      className="min-h-screen grid grid-cols-2 bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
        // Contoh cara pakai gambar asli:
        // backgroundImage: 'url(/path/to/leaf-texture.png)'
        // Sementara pakai gradien agar mendekati suasana gelap fotonya:
      }}
    >
      {/* ----------------- SECTOR KIRI: INFORMASI & GUIDEBOOK ----------------- */}
      <div className="flex flex-col justify-center px-10 lg:px-20 py-20 space-y-12">
        
        {/* Judul Besar (Selamat Datang Rangers!) */}
        <div className="space-y-4">
          <h1
            className="text-5xl font-extrabold leading-tight"
            style={{ color: unandColors.brightGreen }}
          >
            Selamat Datang Rangers!
          </h1>
          <p className="text-lg text-white/90 leading-relaxed max-w-2xl">
            BAKTI atau Bimbingan Aktivitas Kemahasiswaan dalam Tradisi Ilmiah
            adalah kegiatan pengenalan terhadap program pendidikan, tradisi
            ilmiah dan pembinaan kegiatan kemahasiswaan di perguruan tinggi
            bagi mahasiswa baru Universitas Andalas.
          </p>
        </div>

        {/* Kotak Guidebook (Dengan efek Glassmorphism tipis) */}
        <div className="border border-white/20 bg-white/5 backdrop-blur-sm rounded-2xl p-8 max-w-xl space-y-6">
          <div className="flex items-center gap-3 text-slate-300 uppercase tracking-wider font-semibold">
            <FiBookOpen className="text-2xl" />
            <span>Guidebook Penggunaan Website</span>
          </div>
          
          {/* Tombol UNDER DEVELOPMENT */}
          <div className="bg-slate-300/10 rounded-xl p-6 text-center border border-white/10">
            <span className="text-2xl font-bold uppercase text-white/60 tracking-widest">
              Under Development
            </span>
          </div>
        </div>
      </div>

      {/* ----------------- SECTOR KANAN: KARTU LOGIN ----------------- */}
      <div className="flex items-center justify-center p-6 md:p-12">
        {/* Kartu Login Putih/Abu-abu Terang */}
        <div className="bg-[#F1F3F4] text-[#1E4D31] rounded-3xl p-10 lg:p-16 w-full max-w-md shadow-2xl space-y-10">
          
          {/* LOGO & NAMA (BAKTI UNAND) */}
          <div className="flex flex-col items-center gap-3 text-center">
            
          </div>

          {/* FORM LOGIN */}
          <form className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Email
              </label>
              <input
                type="email"
                placeholder="Masukkan Email"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#1E4D31]/40 rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
            </div>

            {/* Input Kata Sandi (Dengan Tombol Mata) */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Kata Sandi
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan Kata Sandi"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#1E4D31]/40 rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
              {/* Tombol Tampilkan/Sembunyikan */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-[46px] text-2xl text-[#1E4D31]/60 hover:text-[#1E4D31]"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Lupa Kata Sandi */}
            <div className="text-right">
              <Link
                to="/lupa-password"
                className="text-sm font-semibold text-[#1E4D31] hover:text-[#2ECC71] transition"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            {/* Tombol MASUK (Warna Hijau Tua Unand) */}
            <button
              type="submit"
              className="w-full py-4 text-white text-xl font-bold uppercase rounded-xl transition hover:brightness-110 active:scale-[0.98] shadow-lg"
              style={{ backgroundColor: unandColors.darkGreen }}
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;