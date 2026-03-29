import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
// Ikon dari react-icons (Heroicons set)
import { FiBookOpen, FiEye, FiEyeOff } from 'react-icons/fi';
import loginBg from "../../assets/LoginBackground.webp"
import baktiLogoText from "../../assets/BaktiLogoText.webp"
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Store/useAuthStore';
import SuccessPopUp from '../../components/ui/SuccessPopUp';

function Login() {
  React.useEffect(() => { document.title = "Login | Bakti Unand 2026"; }, []);
  const [showPassword, setShowPassword] = useState(false);

  // KODE WARNA SPESIFIK UNAND (Bisa dipindah ke index.css @theme nantinya)
  const unandColors = {
    darkGreen: '#004D25', // Hijau tua Unand (Background utama)
    brightGreen: '#67E53D', // Hijau terang (Aksen teks)
    leafDark: '#014421', // Hijau daun gelap (Placeholder bg jika tanpa gambar)
  };

  //Menyimpan state untuk input email dan password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //Login Logic
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const { login, setTempToken } = useAuthStore(); // Ambil fungsi login dari Zustand

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/api/auth/login', {
        username: username,
        password: password
      })

      const token = response.data.token;
      const role = response.data.data.role; 
      // Ambil token dari backend

      // EKSEKUSI ZUSTAND! 
      // Ini otomatis nyimpan ke RAM komponen DAN ke Local Storage. Boom!
      login(token, role);
      navigate('/panitia/dashboard');
      setShowSuccessPopup(true);

    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error("Status:", status); // Log seluruh respon error untuk debugging
        console.error("Login error:", data); // Log error detail dari backend untuk debugging

        if (status === 403 && data.requires_password_change === true){
          if (data.token) {
            setTempToken(data.token); // Simpan temp token di Zustand
          }
          alert("Silahkan ubah password Anda terlebih dahulu.");
          navigate('/lupa-password');
        } else if (status === 401) {
          alert("Username atau password salah. Silahkan coba lagi.");
          setErrorMsg("Username atau password salah. Silahkan coba lagi.");
        } else if (status === 404) {
          alert("Akun tidak ditemukan. Silahkan periksa kembali username Anda.");
          setErrorMsg("Akun tidak ditemukan. Silahkan periksa kembali username Anda.");
        } else if (status === 429) {
          alert("Terlalu banyak percobaan login. Silahkan coba lagi nanti.");
          setErrorMsg("Terlalu banyak percobaan login. Silahkan coba lagi nanti.");
        } else if (status === 400) {
          alert("Permintaan tidak valid. Pastikan semua field terisi dengan benar.");
          setErrorMsg("Permintaan tidak valid. Pastikan semua field terisi dengan benar.");
        }
      } else {
        alert("Terjadi kesalahan pada server. Silahkan coba lagi nanti.");
        setErrorMsg("Terjadi kesalahan pada server. Silahkan coba lagi nanti.");  
      }
  } finally { 
      setIsLoading(false); 
    }
  }

  return (
    // MAIN CONTAINER: Menggunakan Grid untuk split screen di desktop, stack di mobile.
    // GANTI baris 'bg-[...]' dengan URL gambar dedaunan asli jika sudah ada.
    <div
      className="min-h-screen md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 flex flex-col bg-cover bg-center text-white font-sans"
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
      </div>

       
      {/* ----------------- SECTOR KANAN: KARTU LOGIN ----------------- */}
      <div className="flex items-center justify-center p-6 md:p-12">
        {/* Kartu Login Putih/Abu-abu Terang */}
        <div className="bg-[#D9D9D9] text-[#1E4D31] rounded-3xl p-10 lg:p-16 w-full max-w-md shadow-2xl space-y-10">
          
          {/* LOGO & NAMA (BAKTI UNAND) */}
          <div className="flex flex-col items-center gap-3 text-center">
            <img src={baktiLogoText} alt="Bakti Logo" className='w-md justify-center flex' />
            <div className='w-full h-1 bg-[#014421]'></div>
          </div>

          {/* FORM LOGIN */}
          <form className="space-y-6">
            
            {/* Input Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Masukkan Username"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#014421] rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
            </div>

            {/* Input Kata Sandi (Dengan Tombol Mata) */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Kata Sandi
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan Kata Sandi"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#014421] rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
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
            

            {/* Tombol MASUK (Warna Hijau Tua Unand) */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 text-white text-xl font-bold uppercase rounded-xl transition shadow-lg flex justify-center items-center gap-3 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
              }`}
              style={{ backgroundColor: unandColors.darkGreen }}
              onClick={handleLogin}
            >
              {isLoading ? (
                <>
                  {/* SVG Ikon Spinner Muter-muter */}
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Masuk</span>
              )}
            </button>
            <div className="w-full text-center mt-6">
              <span className="text-[#1E4D31]/70 text-xs font-bold tracking-wider">
                © 2026 Developed by Neo Telemetri × Bakti UNAND.
              </span>
            </div>
          </form>
        </div>
      </div>
      {/* POP-UP SUKSES LOGIN */}
      <SuccessPopUp
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Login Berhasil!"
      />
    </div>
  );
}

export default Login;