import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Ikon dari react-icons (Heroicons set)
import { FiBookOpen, FiEye, FiEyeOff } from 'react-icons/fi';
import loginBg from "../../assets/LoginBackground.webp"
import baktiLogoText from "../../assets/BaktiLogoText.webp"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Store/useAuthStore';
import SuccessPopUp from '../../components/ui/SuccessPopUp';

function ResetPassword() {
  React.useEffect(() => { document.title = "Lupa Password | Bakti Unand 2026"; }, []);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  //kontrol form
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const unandColors = {
    darkGreen: '#004D25',
    brightGreen: '#67E53D',
    leafDark: '#014421',
  };


  //Logic untuk ganti password
  const tempToken = useAuthStore((state) => state.tempToken);
  const clearTempToken = useAuthStore((state) => state.clearTempToken);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (!tempToken) {
      alert("Akses ditolak! Silakan login terlebih dahulu.");
      return navigate('/login');
    }

    try {
      await axios.post('https://api.baktiunand2026.com/api/auth/ganti-password',
        {
          oldPassword: oldPassword,
          newPassword: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`
          }
        }
      )

      // EKSEKUSI ZUSTAND! 
      clearTempToken();
      navigate('/login');
      setShowSuccessPopup(true);


    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const backendMessage = error.response.data?.message || error.response.data?.error || "Permintaan tidak valid.";
        console.log("Error dari Backend:", error.response.data);

        if (status === 400) {
          alert(`Gagal: ${backendMessage}`);
        } else if (status === 401) {
          alert(`Gagal: ${backendMessage}`)
        } else {
          alert(`Terjadi kesalahan (${status}): ${backendMessage}`);
        }
      } else {
        alert("Terjadi kesalahan pada server. Silahkan coba lagi nanti.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center text-white font-sans"
      style={{
        backgroundImage: `url(${loginBg})`,
      }}
    >
      {/* ----------------- SECTOR KANAN: KARTU UBAH PASSWORD ----------------- */}
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
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Old Password
              </label>
              <input
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                type={showOldPassword ? 'text' : 'password'}
                placeholder="Masukkan Password Lama"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#014421] rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-5 top-[46px] text-2xl text-[#1E4D31]/60 hover:text-[#1E4D31]"
              >
                {showOldPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Input Kata Sandi (Dengan Tombol Mata) */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Password Baru
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#014421] rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
              {/* Tombol Tampilkan/Sembunyikan */}
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-5 top-[46px] text-2xl text-[#1E4D31]/60 hover:text-[#1E4D31]"
              >
                {showNewPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Konfirmasi Password Baru (Dengan Tombol Mata) */}
            <div className="space-y-2 relative">
              <label className="text-sm font-semibold text-[#1E4D31]">
                Konfirmasi Password Baru
              </label>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Konfirmasi Password Baru"
                className="w-full px-5 py-3.5 bg-transparent border-2 border-[#014421] rounded-xl text-lg text-[#1E4D31] focus:border-[#2ECC71] focus:ring-1 focus:ring-[#2ECC71] outline-none transition"
              />
              {/* Tombol Tampilkan/Sembunyikan */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-[46px] text-2xl text-[#1E4D31]/60 hover:text-[#1E4D31]"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || newPassword !== confirmPassword || newPassword.length < 6}
              className={`w-full mt-8 py-4 text-white text-xl font-bold uppercase rounded-xl transition shadow-lg flex justify-center items-center gap-3 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-110 active:scale-[0.98]'
                }`}
              style={{ backgroundColor: unandColors.darkGreen }}
              onClick={handlePasswordChange}
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
                <span>Ubah Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
      {/* POP-UP SUKSES LOGIN */}
      <SuccessPopUp
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        message="Password Berhasil Diubah!"
      />
    </div>
  )
}

export default ResetPassword