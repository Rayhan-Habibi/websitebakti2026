import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../config/api';
import { Html5Qrcode } from 'html5-qrcode';
import useAuthStore from '../../Store/useAuthStore';
import SuccessPopUp from '../ui/SuccessPopUp';
import { FiX, FiLoader, FiChevronDown } from 'react-icons/fi';
import PieChartAbsen from '../dashboard/PieChartAbsen';

function RekapAbsenPopUp({ isOpen, onClose, kegiatanId, namaKegiatan, mode = 'edit' }) {
  const [displayedData, setDisplayedData] = useState([]);
  const [statistikData, setStatistikData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannedQrTokens = useRef(new Set());
  const scannerContainerId = `qr-reader-${kegiatanId || 'default'}`;
  const [tempStatuses, setTempStatuses] = useState({});

  const fetchAbsensi = useCallback(async () => {
    if (!kegiatanId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/api/absensi/kegiatan/${kegiatanId}`);
      setDisplayedData(response.data.data || []);
      setStatistikData(response.data.statistik || null);
      console.log(response.data)
    } catch (error) {
      console.error("Gagal mengambil data absensi:", error);
      setDisplayedData([]);
    } finally {
      setIsLoading(false);
    }
  }, [kegiatanId, token]);

  const handleEditAbsen = async (userId, kegiatanId, statusToUpdate, e) => {
    e.preventDefault();
    try {
      await api.post(`/api/absensi/manual`, { target_user_id: userId, kegiatan_id: kegiatanId, status: statusToUpdate });
      fetchAbsensi();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        alert("Data tidak lengkap");
      } else if (status === 403) {
        alert("Anda tidak memiliki akses untuk merubah status");
      } else {
        alert("Gagal merubah status. Cek internetmu.");
      }
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAbsensi();
    } else {
      setDisplayedData([]);
      scannedQrTokens.current.clear();
    }
  }, [isOpen, fetchAbsensi]);

  // Inisialisasi & Cleanup Scanner
  useEffect(() => {
    if (!isOpen || mode === 'chart') return;

    const timer = setTimeout(() => {
      const container = document.getElementById(scannerContainerId);
      if (!container) return;

      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        async (decodedText) => {
          if (scannedQrTokens.current.has(decodedText)) return;

          try {
            await html5QrCode.pause(true);
          } catch (e) { /* ignore */ }

          try {
            await api.post("/api/absensi/scan", {
              qr_token: decodedText,
              kegiatan_id: kegiatanId,
            });

            scannedQrTokens.current.add(decodedText);
            setShowSuccess(true);
            fetchAbsensi();
          } catch (error) {
            const status = error.response?.status;
            if (status === 400) {
              scannedQrTokens.current.add(decodedText);
            } else {
              console.error("Error scanning QR:", error);
              alert("Gagal memproses scan. Silakan coba lagi.");
            }
          }

          setTimeout(() => {
            try { html5QrCode.resume(); } catch (e) { /* ignore */ }
          }, 2000);
        },
        () => { /* Frame tanpa QR, abaikan */ }
      ).then(() => {
        setIsScanning(true);
      }).catch((err) => {
        console.error("Gagal memulai kamera:", err);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          scannerRef.current.clear();
          scannerRef.current = null;
          setIsScanning(false);
        }).catch(() => {
          try { scannerRef.current?.clear(); } catch (e) { /* ignore */ }
          scannerRef.current = null;
          setIsScanning(false);
        });
      }
    };
  }, [isOpen, kegiatanId, token, scannerContainerId, fetchAbsensi]);

  const getStatusStyle = (status) => {
    const s = status ? status.toUpperCase() : '';
    switch (s) {
      case 'HADIR': return 'bg-[#10B981] text-white border-none'; // Hijau Emerald
      case 'TIDAK HADIR': return 'bg-[#EF4444] text-white border-none'; // Merah
      case 'SAKIT': return 'bg-[#F59E0B] text-white border-none'; // Kuning/Amber
      case 'IZIN': return 'bg-[#3B82F6] text-white border-none'; // Biru
      default: return 'bg-gray-200 text-gray-700 border-gray-300';
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

        {/* --- KONTEN --- */}
        <div className="p-4 md:p-8 overflow-y-auto flex-grow relative">

          {/* NEW: PIE CHART RENDER */}
          {statistikData && (
            <div className="w-full flex justify-center mb-8 border-b-2 border-gray-100 pb-8">
               <div className="w-full max-w-sm border-2 border-gray-200 rounded-2xl p-4 bg-[#F8FAFC]">
                 <PieChartAbsen 
                   totalKegiatan={statistikData.total_peserta || 0}
                   hadir={statistikData.hadir || 0}
                   tidakHadir={statistikData.tidak_hadir || 0}
                   izin={statistikData.izin || 0}
                   sakit={statistikData.sakit || 0}
                   isLoading={isLoading}
                   title={"Statistik\nAcara"}
                   totalLabel="Total Absen"
                 />
               </div>
            </div>
          )}

          {mode !== 'chart' && (
            <div className="flex justify-center mb-4">
              <div className="w-[80%] md:w-[40%] lg:w-[30%] bg-[#D9D9D9]/40 border-2 border-[#014421] rounded-xl p-4 flex flex-col items-center justify-center overflow-hidden">
                <div id={scannerContainerId} className="w-full"></div>
                {!isScanning && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <FiLoader className="animate-spin text-3xl text-[#014421] mb-2" />
                    <span className="font-bold text-sm text-[#014421]">Membuka kamera...</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="w-full mb-4">
            <label className="block text-md font-bold text-[#133F25] mb-2 tracking-wide">
              Nama Kegiatan
            </label>
            <input
              type="text"
              defaultValue={namaKegiatan || "Tanpa Judul"}
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

          <div className="w-full overflow-x-auto pb-2 relative min-h-[150px]">

            {isLoading && (
              <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center rounded-md">
                <FiLoader className="animate-spin text-4xl text-[#014421] mb-2" />
                <span className="font-bold text-[#014421] text-sm animate-pulse">Menarik Data...</span>
              </div>
            )}

            <div className="min-w-[600px] flex flex-col mb-2">
              <div className="flex items-center pb-4 font-black text-[#133F25] text-sm md:text-md tracking-wider border-b-2 border-[#014421] mb-2">
                <div className="w-[5%] text-center hidden md:block">No</div>
                <div className="w-[30%] md:w-[25%] pl-2">Nama</div>
                <div className="w-[18%] hidden md:block">Fakultas</div>
                <div className="w-[20%] text-center">Status</div>
                <div className="w-[20%] text-center">Ubah ke</div>
                <div className="w-[25%] md:w-[12%] text-center">Aksi</div>
              </div>

              {!isLoading && displayedData.length === 0 ? (
                <div className="text-center py-6 font-semibold text-gray-500 italic">
                  Belum ada peserta yang hadir.
                </div>
              ) : (
                <ul className="flex flex-col">
                  {displayedData.map((item, index) => {
                    const originalStatus = item.status ? item.status.toUpperCase() : 'TIDAK HADIR';
                    const currentStatus = tempStatuses[item.id] !== undefined ? tempStatuses[item.id] : originalStatus;
                    const isChanged = currentStatus !== originalStatus;
                    
                    return (
                      <li key={item.id} className="flex py-3 items-center font-semibold text-black/80 text-xs md:text-sm border-b-2 border-[#014421] last:border-b-2 last:border-b-[#014421] hover:bg-gray-50 transition-colors">
                        <div className="w-[5%] text-center font-black hidden md:block">{index + 1}</div>
                        <div className="w-[30%] md:w-[25%] font-bold pl-2 pr-2 truncate" title={item.nama}>{item.nama}</div>
                        <div className="w-[18%] pr-2 truncate hidden md:block" title={item.fakultas}>{item.fakultas}</div>
                        
                        {/* 1. Status Saat Ini (Badge) */}
                        <div className="w-[20%] flex justify-center px-1">
                          <span className={`px-2 md:px-3 py-1 rounded-md text-[9px] md:text-[11px] font-bold uppercase shadow-sm ${getStatusStyle(item.status)}`}>
                            {originalStatus}
                          </span>
                        </div>

                        {/* 2. Dropdown Status Baru (Unstyled) */}
                        <div className="w-[20%] flex justify-center px-1">
                          <div className="relative w-full max-w-[120px]">
                            <select 
                              className="w-full py-1.5 pl-2 pr-5 rounded bg-white border border-gray-300 text-gray-700 font-semibold text-[9px] md:text-[11px] cursor-pointer outline-none appearance-none focus:ring-1 focus:ring-[#133F25]"
                              value={currentStatus}
                              onChange={(e) => setTempStatuses({...tempStatuses, [item.id]: e.target.value})}
                            >
                              <option value="HADIR">HADIR</option>
                              <option value="TIDAK HADIR">TIDAK HADIR</option>
                              <option value="SAKIT">SAKIT</option>
                              <option value="IZIN">IZIN</option>
                            </select>
                            <div className="absolute inset-y-0 right-1 md:right-2 flex items-center pointer-events-none text-gray-500">
                              <FiChevronDown className="text-[10px] md:text-sm" />
                            </div>
                          </div>
                        </div>

                        {/* 3. Tombol Update */}
                        <div className="w-[25%] md:w-[12%] flex justify-center px-1">
                          <button 
                            onClick={(e) => handleEditAbsen(item.user_id || item.target_user_id || item.userId || item.id, kegiatanId, currentStatus, e)}
                            className={`px-2 py-1.5 rounded text-[9px] md:text-[11px] font-black shadow-sm transition-all uppercase w-full max-w-[80px]
                              ${isChanged ? 'bg-[#133F25] hover:bg-[#0a2314] text-white active:scale-95 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'}
                            `}
                            disabled={!isChanged}
                          >
                            Update
                          </button>
                        </div>
                      </li>
                    );
                  })}
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