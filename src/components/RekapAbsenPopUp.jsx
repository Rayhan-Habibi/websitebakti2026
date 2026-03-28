import React, { useState, useEffect, useCallback } from 'react'; // Tambah useCallback
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner'; 
import useAuthStore from '../Store/useAuthStore';
import SuccessPopUp from './SuccessPopUp'; 
import { FiX, FiLoader } from 'react-icons/fi'; // Tambah FiLoader untuk muter-muter

function RekapAbsenPopUp({ isOpen, onClose,  kegiatanId, namaKegiatan }) {
  const [displayedData, setDisplayedData] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const token = useAuthStore((state) => state.token); 
  const [isLoading, setIsLoading] = useState(false); // State Loading aktif

  // 1. PISAHKAN FUNGSI FETCH KE LUAR USE-EFFECT (Pakai useCallback)
  const fetchAbsensi = useCallback(async () => {
    if (!kegiatanId) return;
    setIsLoading(true); // Nyalakan loading
    try {
      const response = await axios.get(`https://api.baktiunand2026.com/api/absensi/kegiatan/${kegiatanId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDisplayedData(response.data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
      setDisplayedData([]);
    } finally {
      setIsLoading(false); // Matikan loading
    }
  }, [kegiatanId, token]);

  // 2. PANGGIL FETCH SAAT MODAL DIBUKA
  useEffect(() => {
    if (isOpen) {
      fetchAbsensi();
    } else {
      setDisplayedData([]); 
    }
  }, [isOpen, fetchAbsensi]);

  // 3. FUNGSI HANDLE SCAN
  const handleScan = async (result) => { // Pastikan pakai async
    if (result && result.length > 0) {
      const tokenQR = result[0].rawValue; 
      
      try {
        await axios.post("https://api.baktiunand2026.com/api/absensi/scan", {
          qr_token: tokenQR,
          kegiatan_id: kegiatanId, 
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setShowSuccess(true);
        // 🔥 REFRESH TABEL SETELAH SUKSES SCAN!
        fetchAbsensi(); 

      } catch (error) {
        console.error("Error scanning QR:", error);
        alert("Gagal memproses scan. Silakan coba lagi.");
      }
    }
  };

  const getStatusButtonStyle = (status) => {
    switch (status) {
      case 'Hadir': return 'bg-[#039914] text-white'; 
      case 'Tidak Hadir': return 'bg-[#990303] text-white'; 
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  // 4. FUNGSI TOGGLE STATUS (Optimistic UI)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Hadir' ? 'Tidak Hadir' : 'Hadir';
    const backupData = [...displayedData];

    // Optimistic Update: Ubah di layar langsung
    setDisplayedData(displayedData.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));

    try {
      // Pastikan endpoint ini sesuai dengan backend-mu ya!
      await axios.patch(`https://api.baktiunand2026.com/api/absensi/${id}/status`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      setDisplayedData(backupData); // Rollback kalau gagal
      alert("Gagal merubah status. Cek internetmu.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans text-[#133F25]">
      
      <div className="bg-white w-full max-w-5xl rounded-md relative shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="px-4 md:px-8 pt-4 pb-4 flex justify-between items-center flex-shrink-0 border-b-2 border-gray-100">
          <h2 className="text-xl lg:text-2xl font-black text-[#004D25] tracking-wide m-0">
            Absensi Anggota
          </h2>
          <button onClick={onClose} className="text-[#133F25] hover:text-red-500 transition-colors">
            <FiX className="text-4xl" />
          </button>
        </div>

        {/* --- KONTEN (Scrollable Area) --- */}
        <div className="p-4 md:p-8 overflow-y-auto flex-grow relative"> 
          
          <div className="flex justify-center mb-4">
            <div className="w-[80%] md:w-[20%] lg:w-[20%] lg:h-45 bg-[#D9D9D9]/40 border-2 border-[#014421] rounded-xl p-8 flex flex-col items-center justify-center">
              <Scanner 
                onScan={handleScan}
                onError={(error) => console.log("Kamera error:", error)}
                components={{ audio: false, finder: true }}
              />
            </div>
          </div>

          <div className="w-full mb-4">
            <label className="block text-md font-bold text-[#133F25] mb-2 tracking-wide">
              Nama Kegiatan
            </label>
            <input 
              type="text" 
              defaultValue={ namaKegiatan || "Tanpa Judul" } 
              className="w-full bg-white border-2 border-[#133F25] rounded-xl px-4 py-4 text-md font-bold text-black/80 focus:outline-none"
              readOnly
            />
          </div>

          <div className="w-full mb-4">
            <label className="block text-md font-bold text-[#133F25] mb-2 tracking-wide">
              Status Kehadiran
            </label>
            <div className="w-full h-0.5 bg-[#133F25]"></div>
          </div>

          {/* --- AREA TABEL & OVERLAY LOADING --- */}
          {/* Kita jadikan div ini relative agar overlay loading bisa nimpa di atasnya */}
          <div className="w-full overflow-x-auto pb-2 relative min-h-[150px]">
            
            {/* 🛑 TIRAI OVERLAY LOADING (MUNCUL KALAU isLoading = true) */}
            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md">
                <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
                <span className="font-bold text-[#014421] text-sm animate-pulse">Menarik Data...</span>
              </div>
            )}

            <div className="min-w-[600px] flex flex-col mb-2">
              <div className="flex items-center pb-4 font-black text-[#133F25] text-md tracking-wider border-b-2 border-[#014421] mb-2">
                <div className="w-[10%] text-center">No.</div>
                <div className="w-[35%]">Nama</div>
                <div className="w-[35%]">Fakultas</div>
                <div className="w-[20%] text-center">Status</div>
              </div>

              {/* Tampilkan pesan kalau data beneran kosong (Bukan karena lagi loading) */}
              {!isLoading && displayedData.length === 0 ? (
                <div className="text-center py-6 font-semibold text-gray-500 italic">
                  Belum ada peserta yang hadir.
                </div>
              ) : (
                <ul className="flex flex-col">
                  {displayedData.map((item, index) => (
                    <li key={item.id} className="flex py-2 items-center font-semibold text-black/80 text-md border-b-2 border-[#014421] last:border-b-2 last:border-b-[#014421] hover:bg-gray-50 transition-colors">
                      <div className="w-[10%] text-center font-bold text-md">{index + 1}</div>
                      <div className="w-[35%] text-md font-medium pr-2 truncate" title={item.nama}>{item.nama}</div>
                      <div className="w-[35%] text-md font-medium pr-2 truncate" title={item.fakultas}>{item.fakultas}</div>
                      <div className="w-[20%] flex justify-center">
                        <button 
                          onClick={() => toggleStatus(item.id, item.status)}
                          className={`px-4 py-2 w-full max-w-[120px] rounded-md font-black text-sm lg:text-xs uppercase shadow-md transition-all active:scale-95 ${getStatusButtonStyle(item.status)}`}
                        >
                          {item.status}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>

        {/* --- FOOTER --- */}
        <div className="px-4 md:px-8 py-5 border-t border-gray-200 bg-white flex justify-end flex-shrink-0">
          <button onClick={onClose} className="flex items-center gap-2.5 bg-[#014421] text-white font-black text-xl uppercase px-12 py-3 rounded-xl shadow-md hover:bg-green-900 transition-colors active:scale-95">
            DONE
          </button>
        </div>

      </div>
      <SuccessPopUp isOpen={showSuccess} onClose={() => setShowSuccess(false)} message="Absensi Berhasil!" />
    </div>
  );
}

export default RekapAbsenPopUp;